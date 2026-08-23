import { fetchDocList, fetchDocContent } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

// design/配下のMarkdown（未実装の設計提案）を一覧表示する。相対パスをそのまま名前として使う。
export function renderDesignView(container: HTMLElement): void {
    renderListDetailView(container, {
        fetchItems: async (): Promise<ListItem[]> => {
            const paths = await fetchDocList('design');
            return paths.map((p) => ({ id: p, name: p }));
        },
        fetchContent: (id) => fetchDocContent('design', id),
        emptyMessage: 'design/配下にMarkdownファイルがありません',
        detailHeight: 480
    });
}
