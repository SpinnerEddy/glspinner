import { fetchDocList, fetchDocContent } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

// docs/配下のMarkdown（実装済みコードのスナップショット）を一覧表示する。相対パスをそのまま名前として使う。
export function renderDocumentView(container: HTMLElement): void {
    renderListDetailView(container, {
        fetchItems: async (): Promise<ListItem[]> => {
            const paths = await fetchDocList('docs');
            return paths.map((p) => ({ id: p, name: p }));
        },
        fetchContent: (id) => fetchDocContent('docs', id),
        emptyMessage: 'docs/配下にMarkdownファイルがありません',
        detailHeight: 480
    });
}
