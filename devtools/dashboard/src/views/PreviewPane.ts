const PREVIEW_URL = import.meta.env.VITE_GLSPINNER_PREVIEW_URL || 'http://127.0.0.1:2222/';

type LogEntry = { level: string; text: string; time: number };

// glspinnerの実行画面(examples/index.html、npm run devで起動するVite dev server)をiframe埋め込みし、
// examples/index.htmlに仕込んだconsole転送スクリプト（postMessage経由）を受け取ってログパネルに表示する。
export function renderPreviewPane(): HTMLElement {
    const pane = document.createElement('div');
    pane.className = 'preview-pane';

    const frameWrap = document.createElement('div');
    frameWrap.className = 'preview-frame-wrap';
    const iframe = document.createElement('iframe');
    iframe.className = 'preview-frame';
    iframe.src = PREVIEW_URL;
    iframe.title = 'glspinner preview';
    frameWrap.appendChild(iframe);
    pane.appendChild(frameWrap);

    const logHeader = document.createElement('div');
    logHeader.className = 'log-header';

    const logTitle = document.createElement('span');
    logTitle.textContent = 'ログ';
    logHeader.appendChild(logTitle);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'refresh-btn';
    clearBtn.textContent = 'クリア';
    logHeader.appendChild(clearBtn);
    pane.appendChild(logHeader);

    const logPanel = document.createElement('div');
    logPanel.className = 'log-panel';
    pane.appendChild(logPanel);

    function appendLog(entry: LogEntry): void {
        const line = document.createElement('div');
        line.className = `log-line log-${entry.level}`;
        const time = new Date(entry.time).toLocaleTimeString('ja-JP', { hour12: false });
        line.textContent = `[${time}] ${entry.text}`;
        logPanel.appendChild(line);
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    clearBtn.addEventListener('click', () => {
        logPanel.innerHTML = '';
    });

    window.addEventListener('message', (event) => {
        if (new URL(PREVIEW_URL).origin !== event.origin) return;
        const data = event.data;
        if (!data || data.source !== 'glspinner-preview') return;

        appendLog({
            level: data.level ?? 'log',
            text: Array.isArray(data.args) ? data.args.join(' ') : String(data.args),
            time: data.time ?? Date.now()
        });
    });

    return pane;
}
