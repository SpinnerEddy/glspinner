export type Task = { id: string; name: string; status: string | null; order: number | null; url: string };
export type Retro = { id: string; name: string; url: string; createdTime: string };
export type Issue = { id: string; name: string; status: string | null; url: string };

async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `リクエスト失敗: ${res.status}`);
    }
    return res.json();
}

async function patchJson(path: string, body: unknown): Promise<void> {
    const res = await fetch(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const responseBody = await res.json().catch(() => ({}));
        throw new Error(responseBody.error ?? `更新失敗: ${res.status}`);
    }
}

export function fetchTasks(): Promise<Task[]> {
    return getJson('/api/notion/tasks');
}

export function fetchRetro(): Promise<Retro[]> {
    return getJson('/api/notion/retro');
}

export function fetchIssues(): Promise<Issue[]> {
    return getJson('/api/notion/issues');
}

export function updateTaskStatus(id: string, status: string): Promise<void> {
    return patchJson(`/api/notion/tasks/${id}`, { status });
}

export function updateIssueStatus(id: string, status: string): Promise<void> {
    return patchJson(`/api/notion/issues/${id}`, { status });
}

export async function fetchPageContent(id: string): Promise<string> {
    const data = await getJson<{ text: string }>(`/api/notion/pages/${id}/content`);
    return data.text;
}

export type DocsRoot = 'design' | 'docs';

export function fetchDocList(root: DocsRoot): Promise<string[]> {
    return getJson(`/api/docs/${root}/list`);
}

export async function fetchDocContent(root: DocsRoot, path: string): Promise<string> {
    const data = await getJson<{ text: string }>(`/api/docs/${root}/content?path=${encodeURIComponent(path)}`);
    return data.text;
}

export type GitBranchInfo = { branch: string; ahead: number; behind: number };
export type GitChangedFile = { path: string; statusLabel: string };
export type GitCommit = { hash: string; shortHash: string; author: string; date: string; subject: string };

export function fetchGitBranchInfo(): Promise<GitBranchInfo> {
    return getJson('/api/git/branch');
}

export function fetchGitChangedFiles(): Promise<GitChangedFile[]> {
    return getJson('/api/git/status');
}

export async function fetchGitFileDiff(path: string): Promise<string> {
    const data = await getJson<{ text: string }>(`/api/git/diff?path=${encodeURIComponent(path)}`);
    return data.text;
}

export function fetchGitCommits(limit = 30): Promise<GitCommit[]> {
    return getJson(`/api/git/commits?limit=${limit}`);
}

export async function fetchGitCommitDiff(hash: string): Promise<string> {
    const data = await getJson<{ text: string }>(`/api/git/show?hash=${encodeURIComponent(hash)}`);
    return data.text;
}

export type ScriptName = 'build' | 'lint' | 'test';
export type ScriptRunResult = { exitCode: number | null; output: string };

export async function runScript(script: ScriptName): Promise<ScriptRunResult> {
    const res = await fetch('/api/scripts/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `実行失敗: ${res.status}`);
    }

    return res.json();
}

// Markdown中のインラインコード片(クラス名/ファイル名)を実ファイルへ解決する。
// 失敗時は例外を投げず空オブジェクトを返す——この機能はあくまで補助的な拡張であり、
// 呼び出し元(codeLinks.ts)が既に描画済みの本文を壊さないようにするため。
export async function resolveCodeLinks(names: string[]): Promise<Record<string, string>> {
    if (names.length === 0) return {};

    const res = await fetch('/api/code/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names })
    });

    if (!res.ok) return {};

    return res.json();
}
