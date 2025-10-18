import { RenderTarget } from "./RenderTarget";
export declare class PingPongRenderTarget {
    private targets;
    private readIndex;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number]);
    get read(): RenderTarget;
    get write(): RenderTarget;
    swap(): void;
    resize(resolution: [number, number]): void;
    dispose(): void;
}
