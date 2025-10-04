import { RenderTargetOperation } from "./RenderTargetOperation";

export class RenderTarget implements RenderTargetOperation {
    private gl: WebGL2RenderingContext;
    private fbo: WebGLFramebuffer | undefined;
    private rbo: WebGLRenderbuffer | undefined;
    private texture: WebGLTexture | undefined;
    private width: number;
    private height: number;

    constructor(gl: WebGL2RenderingContext, resolution: [number, number]) {
        this.gl = gl;
        this.width = resolution[0];
        this.height = resolution[1];
        this.setUpFrameBuffer();
    }

    drawToFrameBuffer(drawFunction: () => void): void {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo!);
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, this.width, this.height);

        drawFunction();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind(index: number): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + index);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture!);
    }

    unbind(): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    getTexture(): WebGLTexture {
        return this.texture!;
    }

    resize(resolution: [number, number]): void {
        if(this.width === resolution[0] && this.height === resolution[1]) return;

        this.width = resolution[0];
        this.height = resolution[1];
    }

    dispose(): void {
        const gl = this.gl;
        if (this.texture) {
            gl.deleteTexture(this.texture);
            this.texture = undefined;
        }
        if (this.rbo) {
            gl.deleteRenderbuffer(this.rbo);
            this.rbo = undefined;
        }
        if (this.fbo) {
            gl.deleteFramebuffer(this.fbo);
            this.fbo = undefined;
        }
    }

    private setUpFrameBuffer(): void {
        const gl = this.gl;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        this.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}