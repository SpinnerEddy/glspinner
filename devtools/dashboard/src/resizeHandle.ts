// ListDetailView（Notionタスク一覧+Markdown詳細）・PreviewPane（Canvas+ログ）・シェル全体（左のプレビュー欄と
// 右のNotionタブの横幅）で共通の「ドラッグ操作で隣接エリアのサイズを変えるバー」を組み立てるユーティリティ。
// ブラウザ組み込みのresizeハンドル（右下の角のみ）やスクロールバーではなく、常に見えているバーをドラッグして
// 隣接エリアのサイズを変える方式に統一するために切り出した。
export type ResizeHandleDirection = 'grow-up' | 'grow-down' | 'grow-left' | 'grow-right';

export type ResizeHandleOptions = {
    // サイズを変更する対象の要素。
    target: HTMLElement;
    getMinSize: () => number;
    getMaxSize: () => number;
    // 'grow-up'/'grow-down': targetの高さを変える横バー（ハンドルは上下端に置く）。
    // 'grow-left'/'grow-right': targetの幅を変える縦バー（ハンドルは左右端に置く）。
    // 'grow-up'/'grow-left': targetがハンドルの下/右側にあり、上/左方向へドラッグすると大きくなる。
    // 'grow-down'/'grow-right': targetがハンドルの上/左側にあり、下/右方向へドラッグすると大きくなる。
    direction: ResizeHandleDirection;
};

const VERTICAL_DIRECTIONS: ResizeHandleDirection[] = ['grow-up', 'grow-down'];

export function createResizeHandle(options: ResizeHandleOptions): HTMLElement {
    const isVertical = VERTICAL_DIRECTIONS.includes(options.direction);

    const handle = document.createElement('div');
    handle.className = `resize-handle ${isVertical ? 'resize-handle-h' : 'resize-handle-v'}`;
    handle.title = isVertical ? 'ドラッグして高さを調整' : 'ドラッグして幅を調整';

    handle.addEventListener('pointerdown', (e: PointerEvent) => {
        handle.setPointerCapture(e.pointerId);
        handle.classList.add('dragging');

        const startCoord = isVertical ? e.clientY : e.clientX;
        const rect = options.target.getBoundingClientRect();
        const startSize = isVertical ? rect.height : rect.width;
        const minSize = options.getMinSize();
        const maxSize = options.getMaxSize();
        const grows = options.direction === 'grow-down' || options.direction === 'grow-right';

        function onPointerMove(moveEvent: PointerEvent): void {
            const coord = isVertical ? moveEvent.clientY : moveEvent.clientX;
            const rawDelta = coord - startCoord;
            const delta = grows ? rawDelta : -rawDelta;
            const nextSize = Math.min(maxSize, Math.max(minSize, startSize + delta));
            if (isVertical) {
                options.target.style.height = `${nextSize}px`;
            } else {
                options.target.style.width = `${nextSize}px`;
            }
        }

        function onPointerUp(upEvent: PointerEvent): void {
            handle.releasePointerCapture(upEvent.pointerId);
            handle.classList.remove('dragging');
            handle.removeEventListener('pointermove', onPointerMove);
            handle.removeEventListener('pointerup', onPointerUp);
        }

        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
    });

    return handle;
}
