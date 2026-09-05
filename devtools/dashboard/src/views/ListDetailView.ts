import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { fetchPageContent } from '../api';
import { createResizeHandle } from '../resizeHandle';

// Markdown内のコードブロックをhighlight.jsでシンタックスハイライトする。
// 言語未指定/未対応言語の場合はhighlightAutoでベストエフォート判定する。
marked.use(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = lang && hljs.getLanguage(lang) ? lang : undefined;
            return language ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
        }
    })
);

export type ListItem = {
    id: string;
    name: string;
    meta?: string;
    status?: string | null;
    url?: string;
};

export type ListDetailOptions = {
    fetchItems: () => Promise<ListItem[]>;
    fetchContent?: (id: string) => Promise<string>;
    statusOptions?: string[];
    onStatusChange?: (id: string, status: string) => Promise<void>;
    emptyMessage: string;
    detailHeight?: number;
    // 'text'指定時はfetchContentの戻り値をMarkdownとして解釈せず、<pre>にそのまま流し込む（diff等の表示用）。
    renderMode?: 'markdown' | 'text';
};

const UNKNOWN_STATUS_LABEL = '(不明)';
const DEFAULT_DETAIL_HEIGHT = 220;
const MIN_DETAIL_HEIGHT = 80;
const MIN_LIST_HEIGHT = 40;

// タスク/振り返り/技術課題の3タブで共通の「スクロールする一覧 + 下部の詳細エリア」レイアウト。
// statusOptionsが与えられている場合はステータス別にグルーピングして表示する。
// 一覧行クリックでNotionページ本文を取得しMarkdownとして詳細エリアに表示する（外部Notion画面へは飛ばない）。
export function renderListDetailView(container: HTMLElement, options: ListDetailOptions): void {
    container.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'view';
    container.appendChild(view);

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '更新';
    refreshBtn.className = 'refresh-btn';
    view.appendChild(refreshBtn);

    const listEl = document.createElement('div');
    listEl.className = 'scroll-list';
    view.appendChild(listEl);

    const detailWrap = document.createElement('div');
    detailWrap.className = 'detail-wrap';

    const detailLink = document.createElement('a');
    detailLink.className = 'detail-open-link';
    detailLink.target = '_blank';
    detailLink.rel = 'noreferrer';
    detailLink.textContent = 'Notionで開く ↗';
    detailLink.hidden = true;
    detailWrap.appendChild(detailLink);

    const detailArea = document.createElement('div');
    detailArea.className = 'detail-area markdown-body';
    detailArea.textContent = '一覧の項目をクリックすると詳細が表示されます';
    detailArea.style.height = `${options.detailHeight ?? DEFAULT_DETAIL_HEIGHT}px`;
    detailWrap.appendChild(detailArea);

    // 詳細エリアの上端をドラッグして高さを変える。ブラウザ組み込みのresizeハンドル（右下の角のみ）だと
    // 全画面表示時に下方向の余白が無く広げられないため、常に見えている上方向へドラッグする方式にしている。
    const resizeHandle = createResizeHandle({
        target: detailArea,
        getMinSize: () => MIN_DETAIL_HEIGHT,
        getMaxSize: () => view.getBoundingClientRect().bottom - listEl.getBoundingClientRect().top - MIN_LIST_HEIGHT,
        direction: 'grow-up'
    });
    view.appendChild(resizeHandle);
    view.appendChild(detailWrap);

    let selectedRow: HTMLElement | null = null;

    async function showDetail(item: ListItem, row: HTMLElement): Promise<void> {
        selectedRow?.classList.remove('selected');
        row.classList.add('selected');
        selectedRow = row;

        detailLink.hidden = !item.url;
        if (item.url) detailLink.href = item.url;

        detailArea.textContent = '読み込み中...';
        try {
            const content = await (options.fetchContent ?? fetchPageContent)(item.id);
            if (options.renderMode === 'text') {
                detailArea.innerHTML = '';
                const pre = document.createElement('pre');
                pre.textContent = content;
                detailArea.appendChild(pre);
            } else {
                detailArea.innerHTML = await marked.parse(content);
            }
        } catch (err) {
            detailArea.textContent = `エラー: ${(err as Error).message}`;
        }
    }

    async function load(): Promise<void> {
        listEl.textContent = '読み込み中...';
        try {
            const items = await options.fetchItems();
            renderList(items);
        } catch (err) {
            listEl.textContent = `エラー: ${(err as Error).message}`;
        }
    }

    function renderList(items: ListItem[]): void {
        listEl.innerHTML = '';
        selectedRow = null;

        if (items.length === 0) {
            listEl.textContent = options.emptyMessage;
            return;
        }

        if (options.statusOptions) {
            renderGrouped(items, options.statusOptions);
        } else {
            for (const item of items) listEl.appendChild(renderRow(item));
        }
    }

    function renderGrouped(items: ListItem[], statusOptions: string[]): void {
        const grouped = new Map<string, ListItem[]>();
        for (const item of items) {
            const key = item.status ?? UNKNOWN_STATUS_LABEL;
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key)!.push(item);
        }

        const otherStatuses = [...grouped.keys()].filter((s) => !statusOptions.includes(s));
        const orderedStatuses = [...statusOptions, ...otherStatuses];

        for (const status of orderedStatuses) {
            const itemsInGroup = grouped.get(status);
            if (!itemsInGroup || itemsInGroup.length === 0) continue;

            const groupEl = document.createElement('section');
            groupEl.className = 'list-group';

            const heading = document.createElement('h3');
            heading.textContent = `${status} (${itemsInGroup.length})`;
            groupEl.appendChild(heading);

            for (const item of itemsInGroup) groupEl.appendChild(renderRow(item));

            listEl.appendChild(groupEl);
        }
    }

    function renderRow(item: ListItem): HTMLElement {
        const row = document.createElement('div');
        row.className = 'list-row';

        const name = document.createElement('span');
        name.className = 'row-name';
        name.textContent = item.name;
        name.addEventListener('click', () => showDetail(item, row));
        row.appendChild(name);

        const controls = document.createElement('span');
        controls.className = 'row-controls';

        if (options.statusOptions && options.onStatusChange) {
            controls.appendChild(renderStatusSelect(item, controls));
        }

        if (item.meta) {
            const meta = document.createElement('span');
            meta.className = 'meta';
            meta.textContent = item.meta;
            controls.appendChild(meta);
        }

        if (item.url) {
            controls.appendChild(renderCopyLinkButton(item.url));
        }

        row.appendChild(controls);
        return row;
    }

    function renderCopyLinkButton(url: string): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.title = 'Notionリンクをコピー';
        btn.textContent = '🔗';

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const ok = await copyToClipboard(url);
            btn.textContent = ok ? '✓' : '×';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '🔗';
                btn.disabled = false;
            }, 1200);
        });

        return btn;
    }

    function renderStatusSelect(item: ListItem, controls: HTMLElement): HTMLSelectElement {
        const select = document.createElement('select');
        for (const opt of options.statusOptions!) {
            const optionEl = document.createElement('option');
            optionEl.value = opt;
            optionEl.textContent = opt;
            optionEl.selected = opt === item.status;
            select.appendChild(optionEl);
        }

        select.addEventListener('click', (e) => e.stopPropagation());
        select.addEventListener('change', () => {
            const nextStatus = select.value;
            const prevStatus = item.status;
            select.disabled = true;

            options
                .onStatusChange!(item.id, nextStatus)
                .then(load)
                .catch((err: Error) => {
                    select.disabled = false;
                    select.value = prevStatus ?? options.statusOptions![0];

                    controls.querySelector('.error')?.remove();
                    const errorEl = document.createElement('span');
                    errorEl.className = 'error';
                    errorEl.textContent = err.message;
                    controls.appendChild(errorEl);
                });
        });

        return select;
    }

    refreshBtn.addEventListener('click', load);
    load();
}

// navigator.clipboardが使えない環境（VSCode Simple Browser等の制約されたwebview）向けに
// document.execCommand('copy')へフォールバックする。
async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // フォールバックへ続行
        }
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch {
        return false;
    }
}
