export class ShaderProgram{
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private vertexShader: WebGLShader | undefined;
    private fragmentShader: WebGLShader | undefined;

    constructor(gl: WebGL2RenderingContext, vertShaderSource: string, fragShaderSource: string){
        this.gl = gl;
        this.program = this.createProgram(vertShaderSource, fragShaderSource);
    }

    public getProgram(): WebGLProgram{
        return this.program;
    }

    private createProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram{
        const program = this.gl.createProgram();

        this.vertexShader = this.compileShader(vertexShaderSource, 'vert');
        this.fragmentShader = this.compileShader(fragmentShaderSource, 'frag');
        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);
        this.gl.linkProgram(program);

        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
            this.gl.useProgram(program);

            console.log('Create program success!!');

            return program;
        }
        else{
            alert(this.gl.getProgramInfoLog(program));
            throw new Error('Cannot create program!!');
        }
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
}