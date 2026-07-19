import { RenderTargetOperation } from "./RenderTargetOperation";
export declare class ScreenRenderTarget implements RenderTargetOperation {
    private gl;
    private width;
    private height;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number]);
    bindAsDrawTarget(): void;
    getColorTexture(_index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getFrameBuffer(): WebGLFramebuffer;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
}
