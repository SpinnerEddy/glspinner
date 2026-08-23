const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2025-09-03';

const MAX_CONTENT_BLOCKS = 200;

export type NotionListItem = {
    id: string;
    url: string;
    createdTime: string;
    properties: Record<string, unknown>;
};

export type PropertyKind = 'status' | 'select';

export type NotionClient = {
    queryDatabase(databaseId: string, filter?: unknown): Promise<NotionListItem[]>;
    updateSelectLikeProperty(databaseId: string, pageId: string, propertyName: string, kind: PropertyKind, value: string): Promise<void>;
    getPageContent(pageId: string): Promise<string>;
};

async function notionRequest(token: string, path: string, init: RequestInit = {}): Promise<any> {
    const res = await fetch(`${NOTION_API_BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
            ...init.headers
        }
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Notion API error ${res.status} (${path}): ${body}`);
    }

    return res.json();
}

async function resolveDataSourceId(token: string, databaseId: string): Promise<string> {
    const database = await notionRequest(token, `/databases/${databaseId}`);
    const dataSources = database.data_sources as Array<{ id: string; name: string }> | undefined;

    if (!dataSources || dataSources.length === 0) {
        throw new Error(`データベース ${databaseId} にdata_sourceが見つからない`);
    }

    return dataSources[0].id;
}

type RichText = {
    plain_text: string;
    href: string | null;
    annotations?: { bold?: boolean; italic?: boolean; strikethrough?: boolean; code?: boolean };
};

// 太字/斜体/取り消し線/インラインコード/リンクをMarkdownのインライン記法へ変換する。
function richTextToMarkdown(richText: RichText[] | undefined): string {
    if (!richText) return '';
    return richText
        .map((t) => {
            let text = t.plain_text;
            if (!text) return '';

            const a = t.annotations;
            if (a?.code) text = `\`${text}\``;
            if (a?.bold) text = `**${text}**`;
            if (a?.italic) text = `_${text}_`;
            if (a?.strikethrough) text = `~~${text}~~`;
            if (t.href) text = `[${text}](${t.href})`;

            return text;
        })
        .join('');
}

const LIST_BLOCK_TYPES = new Set(['bulleted_list_item', 'numbered_list_item', 'to_do']);

function isListBlock(type: string): boolean {
    return LIST_BLOCK_TYPES.has(type);
}

function blockToMarkdown(block: any): string | null {
    const data = block[block.type];

    switch (block.type) {
        case 'paragraph':
            return richTextToMarkdown(data?.rich_text);
        case 'heading_1':
            return `# ${richTextToMarkdown(data?.rich_text)}`;
        case 'heading_2':
            return `## ${richTextToMarkdown(data?.rich_text)}`;
        case 'heading_3':
            return `### ${richTextToMarkdown(data?.rich_text)}`;
        case 'bulleted_list_item':
        case 'numbered_list_item':
            return `- ${richTextToMarkdown(data?.rich_text)}`;
        case 'to_do':
            return `- [${data?.checked ? 'x' : ' '}] ${richTextToMarkdown(data?.rich_text)}`;
        case 'quote':
            return `> ${richTextToMarkdown(data?.rich_text)}`;
        case 'code':
            return `\`\`\`\n${richTextToMarkdown(data?.rich_text)}\n\`\`\``;
        case 'callout':
            return `> 💡 ${richTextToMarkdown(data?.rich_text)}`;
        case 'divider':
            return '---';
        default:
            return richTextToMarkdown(data?.rich_text) || null;
    }
}

async function fetchBlockChildren(token: string, blockId: string): Promise<any[]> {
    const results: any[] = [];
    let cursor: string | undefined;

    do {
        const query = cursor ? `?page_size=100&start_cursor=${cursor}` : '?page_size=100';
        const data = await notionRequest(token, `/blocks/${blockId}/children${query}`);
        results.push(...data.results);
        cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor && results.length < MAX_CONTENT_BLOCKS);

    return results;
}

export function createNotionClient(token: string): NotionClient {
    const dataSourceIdCache = new Map<string, string>();

    async function getDataSourceId(databaseId: string): Promise<string> {
        const cached = dataSourceIdCache.get(databaseId);
        if (cached) return cached;

        const dataSourceId = await resolveDataSourceId(token, databaseId);
        dataSourceIdCache.set(databaseId, dataSourceId);
        return dataSourceId;
    }

    async function queryDatabase(databaseId: string, filter?: unknown): Promise<NotionListItem[]> {
        const dataSourceId = await getDataSourceId(databaseId);
        const body: Record<string, unknown> = { page_size: 50 };
        if (filter) body.filter = filter;

        const data = await notionRequest(token, `/data_sources/${dataSourceId}/query`, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        return (data.results as any[]).map((page) => ({
            id: page.id,
            url: page.url,
            createdTime: page.created_time,
            properties: page.properties
        }));
    }

    // select/status型はNotionが未知の名前を渡すと新しい選択肢を無言で作ってしまうため、
    // 既存の選択肢一覧と突き合わせてから id 指定で更新する（typo等での事故防止）。
    async function findOptionId(dataSourceId: string, propertyName: string, kind: PropertyKind, value: string): Promise<string> {
        const dataSource = await notionRequest(token, `/data_sources/${dataSourceId}`);
        const prop = dataSource.properties?.[propertyName];
        const options = (kind === 'status' ? prop?.status?.options : prop?.select?.options) as Array<{ id: string; name: string }> | undefined;

        const match = options?.find((o) => o.name === value);
        if (!match) {
            const known = options?.map((o) => o.name).join(', ') ?? '(プロパティが見つからない)';
            throw new Error(`プロパティ「${propertyName}」に選択肢「${value}」が存在しない（既存: ${known}）`);
        }

        return match.id;
    }

    async function updateSelectLikeProperty(databaseId: string, pageId: string, propertyName: string, kind: PropertyKind, value: string): Promise<void> {
        const dataSourceId = await getDataSourceId(databaseId);
        const optionId = await findOptionId(dataSourceId, propertyName, kind, value);
        const propertyValue = kind === 'status' ? { type: 'status', status: { id: optionId } } : { type: 'select', select: { id: optionId } };

        await notionRequest(token, `/pages/${pageId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                properties: { [propertyName]: propertyValue }
            })
        });
    }

    async function getPageContent(pageId: string): Promise<string> {
        const topBlocks = await fetchBlockChildren(token, pageId);
        const units: Array<{ text: string; isList: boolean }> = [];

        for (const block of topBlocks) {
            const line = blockToMarkdown(block);
            if (line !== null) units.push({ text: line, isList: isListBlock(block.type) });

            if (block.has_children && units.length < MAX_CONTENT_BLOCKS) {
                const children = await fetchBlockChildren(token, block.id);
                for (const child of children) {
                    const childLine = blockToMarkdown(child);
                    if (childLine === null) continue;
                    // ネストしたリスト項目はインデントして親のMarkdownリストの子として扱う
                    const indented = isListBlock(child.type) ? `  ${childLine}` : childLine;
                    units.push({ text: indented, isList: isListBlock(child.type) });
                }
            }
        }

        if (units.length === 0) return '(本文なし)';

        const parts: string[] = [units[0].text];
        for (let i = 1; i < units.length; i++) {
            const separator = units[i].isList && units[i - 1].isList ? '\n' : '\n\n';
            parts.push(separator, units[i].text);
        }

        return parts.join('');
    }

    return { queryDatabase, updateSelectLikeProperty, getPageContent };
}
