import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';

const execFileAsync = promisify(execFile);
const HASH_PATTERN = /^[0-9a-f]{4,40}$/i;

const STATUS_LABELS: Record<string, string> = {
    M: '変更',
    A: '追加',
    D: '削除',
    R: '名前変更',
    C: 'コピー',
    U: '競合',
    '?': '未追跡',
    '!': '無視'
};

function labelForStatusCode(code: string): string {
    const primary = code.trim().charAt(0) || code.charAt(1);
    return STATUS_LABELS[primary] ?? code.trim();
}

type ChangedFile = { path: string; statusLabel: string };
type CommitEntry = { hash: string; shortHash: string; author: string; date: string; subject: string };
type BranchInfo = { branch: string; ahead: number; behind: number };

function sendJson(res: ServerResponse, status: number, body: unknown): void {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
}

async function handleError(res: ServerResponse, err: unknown): Promise<void> {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
}

// 現在ブランチ・未コミット差分・直近コミットログをdevサーバー経由で読み取るための中継。
// notion-relay-plugin/docs-relay-pluginと同様、Express等は追加せず素朴なNode httpハンドラで実装する。
export function gitRelayPlugin(): Plugin {
    const repoRoot = path.resolve(process.cwd(), '../..');

    async function git(args: string[]): Promise<string> {
        const { stdout } = await execFileAsync('git', args, { cwd: repoRoot, maxBuffer: 10 * 1024 * 1024 });
        return stdout;
    }

    async function getBranchInfo(): Promise<BranchInfo> {
        const branch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).trim();

        let ahead = 0;
        let behind = 0;
        try {
            const counts = (await git(['rev-list', '--left-right', '--count', 'HEAD...@{u}'])).trim();
            const [a, b] = counts.split(/\s+/).map(Number);
            ahead = a ?? 0;
            behind = b ?? 0;
        } catch {
            // upstream未設定のブランチではahead/behindを計測しない
        }

        return { branch, ahead, behind };
    }

    async function getChangedFiles(): Promise<ChangedFile[]> {
        const raw = await git(['status', '--porcelain=v1']);
        return raw
            .split('\n')
            .filter((line) => line.length > 0)
            .map((line) => {
                const code = line.slice(0, 2);
                const rest = line.slice(3);
                const filePath = rest.includes(' -> ') ? rest.split(' -> ')[1] : rest;
                return { path: filePath, statusLabel: labelForStatusCode(code) };
            })
            .sort((a, b) => a.path.localeCompare(b.path));
    }

    async function getCommits(limit: number): Promise<CommitEntry[]> {
        const raw = await git(['log', `-n${limit}`, '--pretty=format:%H%x1f%h%x1f%an%x1f%ad%x1f%s', '--date=format:%Y-%m-%d %H:%M']);
        if (!raw.trim()) return [];
        return raw.split('\n').map((line) => {
            const [hash, shortHash, author, date, subject] = line.split('\x1f');
            return { hash, shortHash, author, date, subject };
        });
    }

    return {
        name: 'glspinner-dashboard-git-relay',
        configureServer(server) {
            const handler: Connect.NextHandleFunction = async (req: IncomingMessage, res: ServerResponse, next) => {
                const method = req.method ?? 'GET';
                const parsedUrl = new URL(req.url ?? '', 'http://localhost');
                const action = parsedUrl.pathname.split('/').filter(Boolean)[0];

                try {
                    if (method !== 'GET') return next();

                    if (action === 'branch') {
                        return sendJson(res, 200, await getBranchInfo());
                    }

                    if (action === 'status') {
                        return sendJson(res, 200, await getChangedFiles());
                    }

                    if (action === 'diff') {
                        const relPath = parsedUrl.searchParams.get('path') ?? '';
                        if (!relPath) throw new Error('pathが指定されていない');
                        const text = await git(['diff', 'HEAD', '--', relPath]);
                        return sendJson(res, 200, { text: text || '(差分なし。新規追加された未追跡ファイルの可能性があります)' });
                    }

                    if (action === 'commits') {
                        const limitParam = Number(parsedUrl.searchParams.get('limit') ?? '30');
                        const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 30;
                        return sendJson(res, 200, await getCommits(limit));
                    }

                    if (action === 'show') {
                        const hash = parsedUrl.searchParams.get('hash') ?? '';
                        if (!HASH_PATTERN.test(hash)) throw new Error('不正なコミットハッシュ');
                        const text = await git(['show', hash]);
                        return sendJson(res, 200, { text });
                    }

                    next();
                } catch (err) {
                    await handleError(res, err);
                }
            };

            server.middlewares.use('/api/git', handler);
        }
    };
}
