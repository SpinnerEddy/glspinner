import { TextureOperation } from "./TextureOperation";

export class Texture2D implements TextureOperation {
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture | undefined;
    private image: HTMLImageElement | undefined;

    constructor(gl: WebGL2RenderingContext, source: string){
        this.gl = gl;
        this.setUpTexture(source);
    }

    bind(index: number): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + index);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture!);
    }

    unbind(): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    getTextureSize(): {width: number, height: number} {
        if(this.image){
            return {width: this.image.width, height: this.image.height};
        }

        return {width: 0, height: 0};
    }

    private setUpTexture(source: string): void {
        this.texture = this.gl.createTexture();
        this.image = new Image();
        this.image.onload = () => {
            const { gl, image, texture } = this;
            gl.bindTexture(gl.TEXTURE_2D, texture!);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image!);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        this.image.src = source;
    }
}