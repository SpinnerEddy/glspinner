import { runScript, type ScriptName } from '../api';

const SCRIPTS: { id: ScriptName; label: string }[] = [
    { id: 'build', label: 'ビルド (npm run build)' },
    { id: 'lint', label: 'Lint (npm run lint)' },
    { id: 'test', label: 'テスト (npm test)' }
];

// build/lint/testの3つだけをボタンから実行できるタブ。VSCodeのターミナルを開かずに確認するための用途。
// ストリーミング表示はせず、プロセス終了後にまとめて出力を表示する簡素な方式。
export function renderScriptsView(container: HTMLElement): void {
    container.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'view';
    container.appendChild(view);

    const buttonRow = document.createElement('div');
    buttonRow.className = 'scripts-button-row';
    view.appendChild(buttonRow);

    const statusEl = document.createElement('div');
    statusEl.className = 'scripts-status';
    statusEl.textContent = '上のボタンから実行してください';
    view.appendChild(statusEl);

    const outputEl = document.createElement('pre');
    outputEl.className = 'scripts-output';
    view.appendChild(outputEl);

    const buttons: HTMLButtonElement[] = [];

    function setRunning(running: boolean): void {
        for (const btn of buttons) btn.disabled = running;
    }

    async function run(script: ScriptName, label: string): Promise<void> {
        setRunning(true);
        statusEl.textContent = `${label} 実行中...`;
        statusEl.className = 'scripts-status running';
        outputEl.textContent = '';

        try {
            const result = await runScript(script);
            const ok = result.exitCode === 0;
            statusEl.textContent = `${label} ${ok ? '成功' : `失敗 (exit ${result.exitCode})`}`;
            statusEl.className = `scripts-status ${ok ? 'success' : 'failure'}`;
            outputEl.textContent = result.output || '(出力なし)';
        } catch (err) {
            statusEl.textContent = `エラー: ${(err as Error).message}`;
            statusEl.className = 'scripts-status failure';
        } finally {
            setRunning(false);
        }
    }

    for (const s of SCRIPTS) {
        const btn = document.createElement('button');
        btn.textContent = s.label;
        btn.className = 'refresh-btn';
        btn.addEventListener('click', () => run(s.id, s.label));
        buttonRow.appendChild(btn);
        buttons.push(btn);
    }
}
