import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';

const execFileAsync = promisify(execFile);

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

async function handleError(res: ServerResponse, err: unknown): Promise<void> {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
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

// Markdown中の`ClassName`のようなインラインコード片をクリックしてVSCodeで直接開けるようにするための中継。
// git ls-filesで.gitignore済みの追跡ファイル一覧を取得し、拡張子有無どちらでもbasenameが一致すれば
// vscode://file/ URIを返す。通常のブラウザ(Chrome等)で開いていれば、クリック時にOS登録済みの
// VSCodeプロトコルハンドラが起動しファイルが開く（サーバー側はURIを返すだけで起動処理には関与しない）。
export function codeRelayPlugin(): Plugin {
    const repoRoot = path.resolve(process.cwd(), '../..');

    async function listTrackedFiles(): Promise<string[]> {
        const { stdout } = await execFileAsync('git', ['ls-files'], { cwd: repoRoot, maxBuffer: 10 * 1024 * 1024 });
        return stdout.split('\n').filter(Boolean);
    }

    function toVscodeUri(relPath: string): string {
        const absPosix = path.resolve(repoRoot, relPath).split(path.sep).join('/');
        return `vscode://file/${absPosix}`;
    }

    // basename（拡張子込み/抜き どちらでも）が完全一致するものだけを対象にする。
    // 複数ヒットした場合はpath文字列でソートして先頭を採用（決め打ちだが単純さを優先）。
    function resolveOne(files: string[], name: string): string | null {
        const trimmed = name.trim();
        if (!trimmed) return null;

        const matches = files.filter((f) => {
            const base = path.basename(f);
            const baseNoExt = base.slice(0, base.length - path.extname(base).length);
            return base === trimmed || baseNoExt === trimmed;
        });

        if (matches.length === 0) return null;
        matches.sort();
        return toVscodeUri(matches[0]);
    }

    return {
        name: 'glspinner-dashboard-code-relay',
        configureServer(server) {
            const handler: Connect.NextHandleFunction = async (req: IncomingMessage, res: ServerResponse, next) => {
                const method = req.method ?? 'GET';
                const action = new URL(req.url ?? '', 'http://localhost').pathname.split('/').filter(Boolean)[0];

                try {
                    if (method === 'POST' && action === 'resolve') {
                        const body = await readJsonBody(req);
                        const names = Array.isArray(body.names)
                            ? (body.names as unknown[]).filter((n): n is string => typeof n === 'string')
                            : [];
                        const files = await listTrackedFiles();

                        const result: Record<string, string> = {};
                        for (const name of new Set(names)) {
                            const uri = resolveOne(files, name);
                            if (uri) result[name] = uri;
                        }
                        return sendJson(res, 200, result);
                    }
                    next();
                } catch (err) {
                    await handleError(res, err);
                }
            };

            server.middlewares.use('/api/code', handler);
        }
    };
}
