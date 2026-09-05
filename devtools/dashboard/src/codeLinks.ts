import { resolveCodeLinks } from './api';

// Markdown本文中のインラインコード（<pre>の外の<code>）のうち、実在するファイル名/クラス名と
// 一致するものだけをvscode://file/ へのリンクに変換する。コードブロック内部やhljsトークンには影響しない。
export async function linkifyCodeSpans(container: HTMLElement): Promise<void> {
    const codeElements = Array.from(container.querySelectorAll('code')).filter((el) => !el.closest('pre'));
    if (codeElements.length === 0) return;

    let resolved: Record<string, string>;
    try {
        resolved = await resolveCodeLinks(codeElements.map((el) => el.textContent ?? ''));
    } catch {
        return; // 失敗しても既に描画済みの本文はそのまま残す
    }

    for (const codeEl of codeElements) {
        const uri = resolved[codeEl.textContent ?? ''];
        if (!uri) continue;

        const link = document.createElement('a');
        link.href = uri;
        link.className = 'code-link';
        link.title = 'VS Codeで開く';
        link.appendChild(codeEl.cloneNode(true));
        codeEl.replaceWith(link);
    }
}
