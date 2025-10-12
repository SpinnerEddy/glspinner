export interface RenderTargetOperation {
    drawToFrameBuffer(drawFunction: () => void): void;
    drawToScreen(drawFunction: () => void): void;
    getTexture(): WebGLTexture;
    bind(index: number): void;
    unbind(): void;
    resize(resolution: [number, number]): void;
    dispose(): void;
}