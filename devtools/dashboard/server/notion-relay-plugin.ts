import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';
import { createNotionClient, type NotionClient, type NotionListItem } from './notion-client';

type DashboardEnv = {
    NOTION_TOKEN?: string;
    NOTION_DB_TASKS?: string;
    NOTION_DB_RETRO?: string;
    NOTION_DB_ISSUES?: string;
};

type TaskDto = { id: string; name: string; status: string | null; order: number | null; url: string };
type RetroDto = { id: string; name: string; url: string; createdTime: string };
type IssueDto = { id: string; name: string; status: string | null; url: string };

type NotionPropertyValue = {
    type?: string;
    title?: Array<{ plain_text: string }>;
    status?: { name: string | null } | null;
    select?: { name: string | null } | null;
    number?: number | null;
};

function extractTitle(properties: Record<string, unknown>): string {
    for (const prop of Object.values(properties) as (NotionPropertyValue | undefined)[]) {
        if (prop?.type === 'title' && prop.title) {
            return prop.title.map((t) => t.plain_text).join('');
        }
    }
    return '(無題)';
}

function extractSelectLike(properties: Record<string, unknown>, key: string): string | null {
    const prop = properties[key] as NotionPropertyValue | undefined;
    if (!prop) return null;
    if (prop.type === 'status') return prop.status?.name ?? null;
    if (prop.type === 'select') return prop.select?.name ?? null;
    return null;
}

function extractNumber(properties: Record<string, unknown>, key: string): number | null {
    const prop = properties[key] as NotionPropertyValue | undefined;
    if (prop?.type === 'number') return prop.number ?? null;
    return null;
}

// タスク（Status: status型）
function toTaskDto(item: NotionListItem): TaskDto {
    return {
        id: item.id,
        name: extractTitle(item.properties),
        status: extractSelectLike(item.properties, 'Status'),
        order: extractNumber(item.properties, 'Order'),
        url: item.url
    };
}

function toRetroDto(item: NotionListItem): RetroDto {
    return {
        id: item.id,
        name: extractTitle(item.properties),
        url: item.url,
        createdTime: item.createdTime
    };
}

// 技術課題（ステータス: select型。Notionのデフォルトビューが使う軸と合わせる）
function toIssueDto(item: NotionListItem): IssueDto {
    return {
        id: item.id,
        name: extractTitle(item.properties),
        status: extractSelectLike(item.properties, 'ステータス'),
        url: item.url
    };
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

export function notionRelayPlugin(env: DashboardEnv): Plugin {
    let client: NotionClient | null = null;
    let configError: string | null = null;

    function getClientOrThrow(): NotionClient {
        if (configError) throw new Error(configError);
        if (!client) throw new Error('Notion連携が未設定（.envを確認してください）');
        return client;
    }

    return {
        name: 'glspinner-dashboard-notion-relay',
        configureServer(server) {
            if (!env.NOTION_TOKEN || !env.NOTION_DB_TASKS || !env.NOTION_DB_RETRO || !env.NOTION_DB_ISSUES) {
                configError = '.envにNOTION_TOKEN/NOTION_DB_TASKS/NOTION_DB_RETRO/NOTION_DB_ISSUESを設定してください（.env.example参照）';
            } else {
                client = createNotionClient(env.NOTION_TOKEN);
            }

            const handler: Connect.NextHandleFunction = async (req, res, next) => {
                const url = req.url ?? '';
                const method = req.method ?? 'GET';

                try {
                    if (method === 'GET' && url === '/tasks') {
                        const items = await getClientOrThrow().queryDatabase(env.NOTION_DB_TASKS!);
                        return sendJson(res, 200, items.map(toTaskDto));
                    }

                    const taskPatchMatch = url.match(/^\/tasks\/([^/]+)$/);
                    if (method === 'PATCH' && taskPatchMatch) {
                        const body = await readJsonBody(req);
                        await getClientOrThrow().updateSelectLikeProperty(env.NOTION_DB_TASKS!, taskPatchMatch[1], 'Status', 'status', body.status as string);
                        return sendJson(res, 200, { ok: true });
                    }

                    if (method === 'GET' && url === '/retro') {
                        const items = await getClientOrThrow().queryDatabase(env.NOTION_DB_RETRO!, {
                            property: 'プロジェクト',
                            select: { equals: 'glspinner' }
                        });
                        return sendJson(res, 200, items.map(toRetroDto));
                    }

                    if (method === 'GET' && url === '/issues') {
                        const items = await getClientOrThrow().queryDatabase(env.NOTION_DB_ISSUES!, {
                            property: 'プロジェクト',
                            select: { equals: 'glspinner' }
                        });
                        return sendJson(res, 200, items.map(toIssueDto));
                    }

                    const issuePatchMatch = url.match(/^\/issues\/([^/]+)$/);
                    if (method === 'PATCH' && issuePatchMatch) {
                        const body = await readJsonBody(req);
                        await getClientOrThrow().updateSelectLikeProperty(env.NOTION_DB_ISSUES!, issuePatchMatch[1], 'ステータス', 'select', body.status as string);
                        return sendJson(res, 200, { ok: true });
                    }

                    const contentMatch = url.match(/^\/pages\/([^/]+)\/content$/);
                    if (method === 'GET' && contentMatch) {
                        const text = await getClientOrThrow().getPageContent(contentMatch[1]);
                        return sendJson(res, 200, { text });
                    }

                    next();
                } catch (err) {
                    await handleError(res, err);
                }
            };

            server.middlewares.use('/api/notion', handler);
        }
    };
}
