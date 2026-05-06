import { RenderTargetOperation } from "./RenderTargetOperation";
import { RenderTargetOption } from "./RenderTargetOption";

export class RenderTarget implements RenderTargetOperation {
    private gl: WebGL2RenderingContext;
    
    private framebuffer!: WebGLFramebuffer;
    private colorTextures!: WebGLTexture[];
    private depthRenderbuffer: WebGLRenderbuffer | undefined;
    
    private width: number;
    private height: number;

    private option: RenderTargetOption;

    constructor(gl: WebGL2RenderingContext, resolution: [number, number], option: RenderTargetOption = {}) {
        this.gl = gl;
        this.width = resolution[0];
        this.height = resolution[1];

        this.framebuffer = gl.createFramebuffer();
        this.colorTextures = [];
        this.option = option;

        this.initialize(option);
    }

    bindAsDrawTarget(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer!);
        this.gl.viewport(0, 0, this.width, this.height);
    }

    getFrameBuffer(): WebGLFramebuffer {
        return this.framebuffer;    
    }

    getColorTexture(index: number = 0): WebGLTexture {
        if(index !== 0){
            throw new Error("Only single color attachment supported!");
        }
        return this.colorTextures?.at(index)!;
    }

    getDepthTexture(): WebGLTexture {
        throw new Error("Method not implemented.");
    }

    getSize(): [number, number] {
        return [this.width, this.height];
    }

    resize(resolution: [number, number]): void {
        if(this.width === resolution[0] && this.height === resolution[1]) return;

        this.width = resolution[0];
        this.height = resolution[1];

        this.dispose();

        this.framebuffer = this.gl.createFramebuffer();
        this.colorTextures = [];

        this.initialize(this.option);
    }

    dispose(): void {
        const gl = this.gl;

        if (this.colorTextures) {
            this.colorTextures.forEach(element => {
                gl.deleteTexture(element);
            });
        }
        if (this.depthRenderbuffer) {
            gl.deleteRenderbuffer(this.depthRenderbuffer);
        }
        if (this.framebuffer) {
            gl.deleteFramebuffer(this.framebuffer);
        }
    }

    private initialize(option: RenderTargetOption): void {
        const gl = this.gl;

        const colorTextureCount = option.colorTextureCount ?? 1;
        const useDepth = option.useDepth ?? false;

        this.colorTextures = [];

        // フレームバッファ
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        // カラーテクスチャ
        for(let i = 0; i < colorTextureCount; i++){
            const colorTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, colorTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, colorTexture, 0);
            this.colorTextures?.push(colorTexture);
        }

        // depth
        if(useDepth){
            this.depthRenderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRenderbuffer);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}