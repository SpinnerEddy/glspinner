import { ShaderAttribute } from "./attribute/ShaderAttribute";
import { ShaderUniform } from "./uniform/ShaderUniform";
import { ShaderUniformValue } from "./uniform/ShaderUniformValue";

export class ShaderProgram{
    private program: WebGLProgram;
    private vertexShader: WebGLShader | undefined;
    private fragmentShader: WebGLShader | undefined;
    private attributes: Map<string, ShaderAttribute> = new Map();
    private uniforms: Map<string, ShaderUniform> = new Map();

    constructor(gl: WebGL2RenderingContext, vertShaderSource: string, fragShaderSource: string){
        this.program = this.createProgram(gl, vertShaderSource, fragShaderSource);
    }

    public use(gl: WebGL2RenderingContext): void {
        gl.useProgram(this.program);
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }

    public getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute {
        if(!this.attributes.has(name)){
            this.attributes.set(name, new ShaderAttribute(gl, this.program, name));
        }
        return this.attributes.get(name)!;
    }

    public getUniform(gl: WebGL2RenderingContext, name: string): ShaderUniform {
        if(!this.uniforms.has(name)){
            this.uniforms.set(name, new ShaderUniform(gl, this.program, name));
        }
        return this.uniforms.get(name)!;
    }

    public setUniform(gl: WebGL2RenderingContext, name: string, value: ShaderUniformValue): void {
        this.getUniform(gl, name).setUniform(value.getUniformValues(), value.getUniformType())
    }

    private createProgram(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
        const program = gl.createProgram();

        this.vertexShader = this.compileShader(gl, vertexShaderSource, 'vert');
        this.fragmentShader = this.compileShader(gl, fragmentShaderSource, 'frag');
        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            gl.useProgram(program);

            console.log('Create program success!!');

            return program;
        }
        else{
            alert(gl.getProgramInfoLog(program));
            throw new Error('Cannot create program!!');
        }
    }

    private compileShader(gl: WebGL2RenderingContext, shaderSourceStr: string, type: 'vert' | 'frag'): WebGLShader {
        let shader = this.createShader(gl, type);
        gl.shaderSource(shader, shaderSourceStr);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(shader))
            throw new Error('Cannot compile shader!!');
        }
        return shader;
    }
    
    private createShader(gl: WebGL2RenderingContext, type: 'vert' | 'frag'): WebGLShader {
        switch(type){
            case 'vert':
                return gl.createShader(gl.VERTEX_SHADER)!;
            case 'frag':
                return gl.createShader(gl.FRAGMENT_SHADER)!;
            default:
                throw new Error(`Unknown type shader!!`);
        }
    }
}