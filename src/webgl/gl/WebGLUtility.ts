import { Color } from "../../color/Color";

export class WebGLUtility{
    private gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement)
    {
        this.gl = this.initializeWebGL2RenderingContext(canvas);
    }

    public getWebGL2RenderingContext(): WebGL2RenderingContext{
        return this.gl;
    }

    public clearColor(color : Color): void{
        this.gl.clearColor(color.red, color.green, color.blue, color.alpha);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    private initializeWebGL2RenderingContext(canvas: HTMLCanvasElement): WebGL2RenderingContext{
        const gl = canvas.getContext('webgl2');
        if(gl == null){
            throw new Error("Not Support WebGL2!!");
        }
        return gl;
    }
}