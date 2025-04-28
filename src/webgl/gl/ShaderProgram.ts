import { ShaderAttribute } from "./attribute/ShaderAttribute";
import { ShaderUniform } from "./uniform/ShaderUniform";
import { ShaderUniformValue } from "./uniform/ShaderUniformValue";

export class ShaderProgram{
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private vertexShader: WebGLShader | undefined;
    private fragmentShader: WebGLShader | undefined;
    private attributes: Map<string, ShaderAttribute> = new Map();
    private uniforms: Map<string, ShaderUniform> = new Map();

    constructor(gl: WebGL2RenderingContext, vertShaderSource: string, fragShaderSource: string){
        this.gl = gl;
        this.program = this.createProgram(vertShaderSource, fragShaderSource);
    }

    public use(): void{
        this.gl.useProgram(this.program);
    }

    public getProgram(): WebGLProgram{
        return this.program;
    }

    public getVertexShader(): string{
        return this.gl.getShaderSource(this.vertexShader!)!;
    }

    public getFragmentShader(): string{
        return this.gl.getShaderSource(this.fragmentShader!)!;
    }

    public getAttribute(name: string): ShaderAttribute{
        if(!this.attributes.has(name)){
            this.attributes.set(name, new ShaderAttribute(this.gl, this.program, name));
        }
        return this.attributes.get(name)!;
    }

    public getUniform(name: string): ShaderUniform{
        if(!this.uniforms.has(name)){
            this.uniforms.set(name, new ShaderUniform(this.gl, this.program, name));
        }
        return this.uniforms.get(name)!;
    }

    public setUniform(name: string, value: ShaderUniformValue): void{
        this.getUniform(name).setUniform(value.getUniformValues(), value.getUniformType())
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