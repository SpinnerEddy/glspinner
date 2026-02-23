export interface RenderTargetOperation {
    bindAsDrawTarget(): void;
    getColorTexture(index: number): WebGLTexture;
    resize(resolution: [number, number]): void;
    dispose(): void;
}