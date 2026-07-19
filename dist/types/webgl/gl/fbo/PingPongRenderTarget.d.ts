import { RenderTargetOperation } from "./RenderTargetOperation";
export declare class PingPongRenderTarget {
    private targets;
    private readIndex;
    constructor(targetA: RenderTargetOperation, targetB: RenderTargetOperation);
    get read(): RenderTargetOperation;
    get write(): RenderTargetOperation;
    swap(): void;
    resize(resolution: [number, number]): void;
    dispose(): void;
    getColorTexture(index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
}
