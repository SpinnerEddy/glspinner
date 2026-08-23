import './style.css';
import { renderTaskView } from './views/TaskView';
import { renderRetroView } from './views/RetroView';
import { renderIssueView } from './views/IssueView';

type TabId = 'tasks' | 'retro' | 'issues';

const TABS: { id: TabId; label: string; render: (container: HTMLElement) => void }[] = [
    { id: 'tasks', label: 'タスク', render: renderTaskView },
    { id: 'retro', label: '振り返り', render: renderRetroView },
    { id: 'issues', label: '技術課題', render: renderIssueView }
];

function mount(): void {
    const app = document.getElementById('app');
    if (!app) throw new Error('#app が見つからない');

    app.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'app-header';
    header.textContent = 'glspinner Dashboard';
    app.appendChild(header);

    const tabBar = document.createElement('nav');
    tabBar.className = 'tab-bar';
    app.appendChild(tabBar);

    const content = document.createElement('main');
    content.className = 'tab-content';
    app.appendChild(content);

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
}

mount();
