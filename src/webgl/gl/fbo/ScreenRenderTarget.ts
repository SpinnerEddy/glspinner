import { RenderTargetOperation } from "./RenderTargetOperation";

export class ScreenRenderTarget implements RenderTargetOperation {
    private gl: WebGL2RenderingContext;
    
    private width: number;
    private height: number;

    constructor(gl: WebGL2RenderingContext, resolution: [number, number]){
        this.gl = gl;
        this.width = resolution[0];
        this.height = resolution[1];
    }

    bindAsDrawTarget(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.width, this.height);
    }

    getColorTexture(index: number): WebGLTexture {
        throw new Error("ScreenRenderTarget does not have a color texture!");
    }

    getFrameBuffer(): WebGLFramebuffer {
        throw new Error("ScreenRenderTarget does not have a Framebuffer!");
    }

    getSize(): [number, number] {
        return [this.width, this.height];
    }

    resize(resolution: [number, number]): void {
        if(this.width === resolution[0] && this.height === resolution[1]) return;

        this.width = resolution[0];
        this.height = resolution[1];
    }

    dispose(): void {
    }

}