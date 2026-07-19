import { RenderTargetOperation } from "./RenderTargetOperation";
import { CustomRenderTargetOption } from "./RenderTargetOption";
export declare class CustomRenderTarget implements RenderTargetOperation {
    private gl;
    private framebuffer;
    private colorTextures;
    private depthTexture;
    private depthRenderbuffer;
    private width;
    private height;
    private option;
    private colorTextureCount;
    private drawBufferAttachmentPoints;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number], option?: CustomRenderTargetOption);
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index?: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
    private initialize;
    private setUpAttachment;
    private getColorTextureSettingByAttachmentType;
    private getRenderbufferSettingByAttachmentType;
    private getTextureFilters;
}
