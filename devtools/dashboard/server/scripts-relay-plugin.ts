import { spawn } from 'node:child_process';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';

// ダッシュボードから実行できるnpmスクリプトはこの3つに固定する（任意コマンド実行にしないためのホワイトリスト）。
// build/lint/testはいずれもソースを書き換えない読み取り専用の診断コマンドという前提で選定している。
const ALLOWED_SCRIPTS = ['build', 'lint', 'test'] as const;
type AllowedScript = (typeof ALLOWED_SCRIPTS)[number];

function isAllowedScript(value: unknown): value is AllowedScript {
    return typeof value === 'string' && (ALLOWED_SCRIPTS as readonly string[]).includes(value);
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', () => {
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

async function handleError(res: ServerResponse, err: unknown): Promise<void> {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
}

type ScriptRunResult = { exitCode: number | null; output: string };

// eslint/tsc/jestが色付けのために埋め込むANSIエスケープシーケンスを除去する（<pre>にそのまま出すと制御文字が見えるため）。
// eslint-disable-next-line no-control-regex -- ANSIエスケープ(ESC=\x1b)を検出するために制御文字そのものを使う必要がある
const ANSI_ESCAPE_PATTERN = /\x1b\[[0-9;]*m/g;

function stripAnsiCodes(text: string): string {
    return text.replace(ANSI_ESCAPE_PATTERN, '');
}

// npm run <script>をリポジトリルートで実行し、標準出力/標準エラーを結合して返す。
// ストリーミングはせず、プロセス終了まで待って結果を一括で返す簡素な方式（個人用ツールなので十分と判断）。
function runNpmScript(repoRoot: string, script: AllowedScript): Promise<ScriptRunResult> {
    return new Promise((resolve, reject) => {
        // Windowsでnpm(.cmd)を直接spawnするとEINVALになることがあるため、shell経由で実行する。
        // scriptはisAllowedScriptで検証済みの固定値のみなのでshell:trueでもコマンドインジェクションの余地はない。
        const child = spawn('npm', ['run', script], { cwd: repoRoot, shell: true });

        let output = '';
        child.stdout.on('data', (chunk) => (output += chunk));
        child.stderr.on('data', (chunk) => (output += chunk));
        child.on('error', reject);
        child.on('close', (exitCode) => resolve({ exitCode, output: stripAnsiCodes(output) }));
    });
}

export function scriptsRelayPlugin(): Plugin {
    const repoRoot = path.resolve(process.cwd(), '../..');

    return {
        name: 'glspinner-dashboard-scripts-relay',
        configureServer(server) {
            const handler: Connect.NextHandleFunction = async (req: IncomingMessage, res: ServerResponse, next) => {
                const method = req.method ?? 'GET';
                const parsedUrl = new URL(req.url ?? '', 'http://localhost');
                const action = parsedUrl.pathname.split('/').filter(Boolean)[0];

                try {
                    if (method === 'POST' && action === 'run') {
                        const body = await readJsonBody(req);
                        if (!isAllowedScript(body.script)) {
                            throw new Error(`実行できないスクリプト: ${body.script}`);
                        }
                        const result = await runNpmScript(repoRoot, body.script);
                        return sendJson(res, 200, result);
                    }

                    next();
                } catch (err) {
                    await handleError(res, err);
                }
            };

            server.middlewares.use('/api/scripts', handler);
        }
    };
}
