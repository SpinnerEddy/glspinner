import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';

const ROOTS = ['design', 'docs'] as const;
type RootName = (typeof ROOTS)[number];

function isRootName(value: string): value is RootName {
    return (ROOTS as readonly string[]).includes(value);
}

function listMarkdownFiles(rootDir: string): string[] {
    const results: string[] = [];

    function walk(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.isFile() && entry.name.endsWith('.md')) {
                results.push(path.relative(rootDir, full).split(path.sep).join('/'));
            }
        }
    }

    if (fs.existsSync(rootDir)) walk(rootDir);
    return results.sort((a, b) => a.localeCompare(b));
}

// クエリのpathがrootDirの外へ逃げていないか（../等でのパストラバーサル）を確認してから絶対パス化する。
function resolveSafePath(rootDir: string, relPath: string): string {
    const full = path.resolve(rootDir, relPath);
    const rootWithSep = rootDir.endsWith(path.sep) ? rootDir : rootDir + path.sep;
    if (full !== rootDir && !full.startsWith(rootWithSep)) {
        throw new Error('不正なパスが指定された');
    }
    return full;
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

// リポジトリルート直下のdesign/・docs/配下にあるMarkdownファイルを一覧・閲覧するための中継。
// notion-relay-pluginと同様、Express等は追加せずNode組み込みhttpハンドラ形式で素朴に実装する。
export function localDocsRelayPlugin(): Plugin {
    const repoRoot = path.resolve(process.cwd(), '../..');

    return {
        name: 'glspinner-dashboard-docs-relay',
        configureServer(server) {
            const handler: Connect.NextHandleFunction = async (req: IncomingMessage, res: ServerResponse, next) => {
                const method = req.method ?? 'GET';
                const parsedUrl = new URL(req.url ?? '', 'http://localhost');
                const segments = parsedUrl.pathname.split('/').filter(Boolean);
                const [rootParam, action] = segments;

                if (!rootParam || !isRootName(rootParam)) return next();

                const rootDir = path.join(repoRoot, rootParam);

                try {
                    if (method === 'GET' && action === 'list') {
                        return sendJson(res, 200, listMarkdownFiles(rootDir));
                    }

                    if (method === 'GET' && action === 'content') {
                        const relPath = parsedUrl.searchParams.get('path') ?? '';
                        const fullPath = resolveSafePath(rootDir, relPath);
                        const text = await fs.promises.readFile(fullPath, 'utf-8');
                        return sendJson(res, 200, { text });
                    }

                    next();
                } catch (err) {
                    await handleError(res, err);
                }
            };

            server.middlewares.use('/api/docs', handler);
        }
    };
}
