import './style.css';
import { renderTaskView } from './views/TaskView';
import { renderRetroView } from './views/RetroView';
import { renderIssueView } from './views/IssueView';
import { renderDesignView } from './views/DesignView';
import { renderDocumentView } from './views/DocumentView';
import { renderGitView } from './views/GitView';
import { renderScriptsView } from './views/ScriptsView';
import { renderPreviewPane } from './views/PreviewPane';
import { createResizeHandle } from './resizeHandle';

const MIN_PREVIEW_PANE_WIDTH = 320;
const MIN_NOTION_PANE_WIDTH = 360;
// 固定pxではなくshell幅に対する割合にすることで、ディスプレイ解像度やChromeウィンドウの
// 大きさに応じてドラッグできる最大幅も自動的に変わるようにしている。
const MAX_NOTION_PANE_RATIO = 0.6;

type TabId = 'tasks' | 'retro' | 'issues' | 'design' | 'docs' | 'git' | 'scripts';

const TABS: { id: TabId; label: string; render: (container: HTMLElement) => void }[] = [
    { id: 'tasks', label: 'タスク', render: renderTaskView },
    { id: 'retro', label: '振り返り', render: renderRetroView },
    { id: 'issues', label: '技術課題', render: renderIssueView },
    { id: 'design', label: '設計', render: renderDesignView },
    { id: 'docs', label: 'ドキュメント', render: renderDocumentView },
    { id: 'git', label: 'Git', render: renderGitView },
    { id: 'scripts', label: 'ビルド', render: renderScriptsView }
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

    const previewPane = renderPreviewPane();
    root.appendChild(previewPane);

    const notionPane = renderNotionPane();

    // 左のプレビュー欄(Canvas+ログ)と右のNotionタブの横幅の境界をドラッグして変える。
    // notion-paneの右端はレイアウト上常に固定（flex-growしない固定幅+右端に配置）で、
    // ドラッグで動くのはnotion-paneの左端（=境界そのもの）だけ。preview-pane側はflex-growで
    // 残りの幅を自動的に埋める（ログ/Canvas境界・Notion一覧/詳細境界と同じ横バー方式の横方向版）。
    const resizeHandle = createResizeHandle({
        target: notionPane,
        getMinSize: () => MIN_NOTION_PANE_WIDTH,
        getMaxSize: () => {
            // CSS側のmax-width:60%はshellのcontent-box（padding除く）を基準に解決されるため、
            // ここでも同じ基準に合わせないと、ドラッグ中の内部計算値と実際の描画サイズがズレる。
            const shellStyle = getComputedStyle(root);
            const paddingX = parseFloat(shellStyle.paddingLeft) + parseFloat(shellStyle.paddingRight);
            const contentWidth = root.getBoundingClientRect().width - paddingX;
            return Math.min(contentWidth * MAX_NOTION_PANE_RATIO, contentWidth - MIN_PREVIEW_PANE_WIDTH);
        },
        direction: 'grow-left'
    });
    root.appendChild(resizeHandle);

    root.appendChild(notionPane);
}

mount();
