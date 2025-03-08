import { Color } from "../../color/Color";
import { Matrix } from "../../math/matrix/Matrix";

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
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public createProgram(vertexShaderSource: string | undefined, fragmentShaderSource: string | undefined): WebGLProgram{
        if(vertexShaderSource == undefined || fragmentShaderSource == undefined){
            throw new Error('Cannot create program!!')
        }
        
        const program = this.gl.createProgram();

        const vertexShader = this.compileShader(vertexShaderSource, 'vert');
        const fragmentShader = this.compileShader(fragmentShaderSource, 'frag');
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
            this.gl.useProgram(program);

            return program;
        }
        else{
            alert(this.gl.getProgramInfoLog(program));
            throw new Error('Cannot create program!!');
        }
    }

    public createVbo(data: Float32Array): WebGLBuffer{
        const vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return vbo;
    }

    public SetAttributeVboLocation(
        program: WebGLProgram, 
        attributeName: string, 
        attributeElementCount: number, 
        vbo: WebGLBuffer){
        const attLocation = this.gl.getAttribLocation(program, attributeName);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.enableVertexAttribArray(attLocation);
        this.gl.vertexAttribPointer(attLocation, attributeElementCount, this.gl.FLOAT, false, 0, 0);
    }

    public SetUniformMatrix(
        program: WebGLProgram,
        uniformName: string,
        matrix: Matrix
    ){
        const uniLocation = this.gl.getUniformLocation(program, uniformName);
        this.gl.uniformMatrix4fv(uniLocation, false, matrix.toArray());
    }

    public drawArrays(pointNumber: number){
        this.gl.drawArrays(this.gl.TRIANGLES, 0, pointNumber);
        this.gl.flush();
    }

    private compileShader(shaderSourceStr: string, type: 'vert' | 'frag'): WebGLShader{
        let shader = this.createShader(type);
        this.gl.shaderSource(shader, shaderSourceStr);
        this.gl.compileShader(shader);
        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            console.log(this.gl.getShaderInfoLog(shader))
            throw new Error('Cannot compile shader!!');
        }
        return shader;
    }

    private createShader(type: 'vert' | 'frag'): WebGLShader{
        switch(type){
            case 'vert':
                return this.gl.createShader(this.gl.VERTEX_SHADER)!;
            case 'frag':
                return this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
            default:
                throw new Error(`Unknown type shader!!`);
        }
    }

    private initializeWebGL2RenderingContext(canvas: HTMLCanvasElement): WebGL2RenderingContext{
        const gl = canvas.getContext('webgl2');
        if(gl == null){
            throw new Error("Not Support WebGL2!!");
        }
        return gl;
    }
}