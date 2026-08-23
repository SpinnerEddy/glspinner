import { fetchRetro } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

// 振り返りDBには現状Status相当のプロパティが無いため statusOptions は指定しない。
// Notion側にプロパティが追加されたら、TaskView/IssueViewと同様に statusOptions + onStatusChange を渡す形に揃える。
export function renderRetroView(container: HTMLElement): void {
    renderListDetailView(container, {
        fetchItems: async (): Promise<ListItem[]> => {
            const items = await fetchRetro();
            return items
                .slice()
                .sort((a, b) => b.createdTime.localeCompare(a.createdTime))
                .map((r) => ({
                    id: r.id,
                    name: r.name,
                    url: r.url,
                    meta: new Date(r.createdTime).toLocaleDateString('ja-JP')
                }));
        },
        emptyMessage: '振り返りはまだありません'
    });
}
