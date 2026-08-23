import { fetchGitBranchInfo, fetchGitChangedFiles, fetchGitFileDiff, fetchGitCommits, fetchGitCommitDiff } from '../api';
import { renderListDetailView, type ListItem } from './ListDetailView';

type GitSubTab = 'changes' | 'history';

const SUB_TABS: { id: GitSubTab; label: string }[] = [
    { id: 'changes', label: '変更' },
    { id: 'history', label: '履歴' }
];

// 「変更」「履歴」の2つのサブタブを持つGitタブ。どちらもListDetailView（一覧+リサイズ可能な詳細欄）を
// 使い回し、diffをrenderMode: 'text'でそのままpreに表示する（Markdownとして誤変換しないため）。
export function renderGitView(container: HTMLElement): void {
    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'git-view';
    container.appendChild(wrap);

    const branchInfo = document.createElement('div');
    branchInfo.className = 'git-branch-info';
    branchInfo.textContent = '読み込み中...';
    wrap.appendChild(branchInfo);

    const subTabBar = document.createElement('nav');
    subTabBar.className = 'tab-bar';
    wrap.appendChild(subTabBar);

    const subContent = document.createElement('div');
    subContent.className = 'tab-content';
    wrap.appendChild(subContent);

    function renderChanges(): void {
        renderListDetailView(subContent, {
            fetchItems: async (): Promise<ListItem[]> => {
                const files = await fetchGitChangedFiles();
                return files.map((f) => ({ id: f.path, name: f.path, meta: f.statusLabel }));
            },
            fetchContent: (filePath) => fetchGitFileDiff(filePath),
            renderMode: 'text',
            emptyMessage: '未コミットの変更はありません'
        });
    }

    function renderHistory(): void {
        renderListDetailView(subContent, {
            fetchItems: async (): Promise<ListItem[]> => {
                const commits = await fetchGitCommits();
                return commits.map((c) => ({ id: c.hash, name: c.subject, meta: `${c.shortHash} ${c.date}` }));
            },
            fetchContent: (hash) => fetchGitCommitDiff(hash),
            renderMode: 'text',
            emptyMessage: 'コミットがありません'
        });
    }

    function activateSub(id: GitSubTab): void {
        for (const btn of Array.from(subTabBar.querySelectorAll('button'))) {
            btn.classList.toggle('active', btn.dataset.sub === id);
        }
        if (id === 'changes') renderChanges();
        else renderHistory();
    }

    for (const tab of SUB_TABS) {
        const btn = document.createElement('button');
        btn.textContent = tab.label;
        btn.dataset.sub = tab.id;
        btn.addEventListener('click', () => activateSub(tab.id));
        subTabBar.appendChild(btn);
    }

    async function loadBranchInfo(): Promise<void> {
        try {
            const info = await fetchGitBranchInfo();
            const parts = [`ブランチ: ${info.branch}`];
            if (info.ahead) parts.push(`↑${info.ahead}`);
            if (info.behind) parts.push(`↓${info.behind}`);
            branchInfo.textContent = parts.join(' ');
        } catch (err) {
            branchInfo.textContent = `エラー: ${(err as Error).message}`;
        }
    }

    loadBranchInfo();
    activateSub('changes');
}
