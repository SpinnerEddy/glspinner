import { RenderTargetOperation } from "./RenderTargetOperation";
export declare class RenderTarget implements RenderTargetOperation {
    private gl;
    private fbo;
    private rbo;
    private texture;
    private width;
    private height;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number]);
    drawToFrameBuffer(drawFunction: () => void): void;
    drawToScreen(drawFunction: () => void): void;
    bind(index: number): void;
    unbind(): void;
    getTexture(): WebGLTexture;
    resize(resolution: [number, number]): void;
    dispose(): void;
    private setUpFrameBuffer;
}
