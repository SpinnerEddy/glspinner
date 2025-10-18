import { TextureOperation } from "./TextureOperation";

export class TextureFrameBuffer implements TextureOperation {
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, texture: WebGLTexture){
        this.gl = gl;
        this.texture = texture;
    }

    bind(index: number): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + index);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture!);
    }

    unbind(): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    getTextureSize(): { width: number; height: number; } {
        throw new Error("Method not implemented.");
    }
}