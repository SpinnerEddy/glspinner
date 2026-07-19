import { RenderTargetOperation } from "./RenderTargetOperation";
import { RenderTargetOption } from "./RenderTargetOption";
export declare class RenderTarget implements RenderTargetOperation {
    private gl;
    private framebuffer;
    private colorTextures;
    private depthRenderbuffer;
    private width;
    private height;
    private option;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number], option?: RenderTargetOption);
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index?: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
    private initialize;
}
