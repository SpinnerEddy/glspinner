import { RenderTarget } from "./RenderTarget";

export class PingPongRenderTarget {
    private targets: [RenderTarget, RenderTarget];
    private readIndex: number = 0;

    constructor(gl: WebGL2RenderingContext, resolution: [number, number]) {
        this.targets = [
            new RenderTarget(gl, resolution),
            new RenderTarget(gl, resolution)
        ];
        this.readIndex = 0;
    }

    get read(): RenderTarget {
        return this.targets[this.readIndex];
    }

    get write(): RenderTarget {
        return this.targets[1 - this.readIndex];
    }

    swap(): void {
        this.readIndex = 1 - this.readIndex;
    }

    resize(resolution: [number, number]): void {
        this.targets[0].resize(resolution);
        this.targets[1].resize(resolution);
    }

    dispose(): void {
        this.targets[0].dispose();
        this.targets[1].dispose();
    }

}