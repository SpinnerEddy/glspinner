
export class Texture2D{
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, path: string){
        const tex = gl.createTexture();

        const image = new Image();

        image.onload = function(){
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        this.texture = tex;
    }

    bind(gl: WebGL2RenderingContext, index: number): void {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    unbind(gl: WebGL2RenderingContext): void {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}