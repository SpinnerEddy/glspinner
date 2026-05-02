import { RenderTargetOperation } from "./RenderTargetOperation";

export class PingPongRenderTarget {
    private targets: [RenderTargetOperation, RenderTargetOperation];
    private readIndex: number = 0;

    constructor(targetA: RenderTargetOperation, targetB: RenderTargetOperation) {
        this.targets = [targetA, targetB];
        this.readIndex = 0;
    }

    get read(): RenderTargetOperation {
        return this.targets[this.readIndex];
    }

    get write(): RenderTargetOperation {
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

    getColorTexture(index: number): WebGLTexture {
        return this.read.getColorTexture(index);
    }

    getDepthTexture(): WebGLTexture {
        return this.read.getDepthTexture();
    }
}