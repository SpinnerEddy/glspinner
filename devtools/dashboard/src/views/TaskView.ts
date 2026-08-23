import { fetchTasks, updateTaskStatus } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

const STATUS_OPTIONS = ['未着手', '進行中', '完了'];

export function renderTaskView(container: HTMLElement): void {
    renderListDetailView(container, {
        fetchItems: async (): Promise<ListItem[]> => {
            const tasks = await fetchTasks();
            return tasks
                .slice()
                .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
                .map((t) => ({ id: t.id, name: t.name, status: t.status, url: t.url }));
        },
        statusOptions: STATUS_OPTIONS,
        onStatusChange: updateTaskStatus,
        emptyMessage: 'タスクはまだありません'
    });
}
