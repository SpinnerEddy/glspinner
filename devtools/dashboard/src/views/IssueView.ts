import { fetchIssues, updateIssueStatus } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

// Notionのデフォルトビューが使う「ステータス」（未解決/調査中/解決済み）を編集対象にする。
// 「Status」（未着手/進行中/完了）という別プロパティも存在するが、今回はこちらを採用しない。
const STATUS_OPTIONS = ['未解決', '調査中', '解決済み'];

export function renderIssueView(container: HTMLElement): void {
    renderListDetailView(container, {
        fetchItems: async (): Promise<ListItem[]> => {
            const items = await fetchIssues();
            return items.map((i) => ({ id: i.id, name: i.name, status: i.status, url: i.url }));
        },
        statusOptions: STATUS_OPTIONS,
        onStatusChange: updateIssueStatus,
        emptyMessage: '技術課題はまだありません'
    });
}
