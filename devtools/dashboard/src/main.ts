import './style.css';
import { renderTaskView } from './views/TaskView';
import { renderRetroView } from './views/RetroView';
import { renderIssueView } from './views/IssueView';
import { renderDesignView } from './views/DesignView';
import { renderDocumentView } from './views/DocumentView';
import { renderPreviewPane } from './views/PreviewPane';

type TabId = 'tasks' | 'retro' | 'issues' | 'design' | 'docs';

const TABS: { id: TabId; label: string; render: (container: HTMLElement) => void }[] = [
    { id: 'tasks', label: 'タスク', render: renderTaskView },
    { id: 'retro', label: '振り返り', render: renderRetroView },
    { id: 'issues', label: '技術課題', render: renderIssueView },
    { id: 'design', label: '設計', render: renderDesignView },
    { id: 'docs', label: 'ドキュメント', render: renderDocumentView }
];

function renderNotionPane(): HTMLElement {
    const pane = document.createElement('div');
    pane.className = 'notion-pane';

    const header = document.createElement('header');
    header.className = 'app-header';
    header.textContent = 'glspinner Dashboard';
    pane.appendChild(header);

    const tabBar = document.createElement('nav');
    tabBar.className = 'tab-bar';
    pane.appendChild(tabBar);

    const content = document.createElement('main');
    content.className = 'tab-content';
    pane.appendChild(content);

    function activate(tabId: TabId): void {
        for (const btn of Array.from(tabBar.querySelectorAll('button'))) {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        }
        const tab = TABS.find((t) => t.id === tabId)!;
        tab.render(content);
    }

    for (const tab of TABS) {
        const btn = document.createElement('button');
        btn.textContent = tab.label;
        btn.dataset.tab = tab.id;
        btn.addEventListener('click', () => activate(tab.id));
        tabBar.appendChild(btn);
    }

    activate('tasks');
    return pane;
}

function mount(): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('#root が見つからない');

    root.innerHTML = '';
    root.className = 'shell';
    root.appendChild(renderPreviewPane());
    root.appendChild(renderNotionPane());
}

mount();
