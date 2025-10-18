import { ShaderAttribute } from "./attribute/ShaderAttribute";
import { ShaderUniform } from "./uniform/ShaderUniform";
import { ShaderUniformValue } from "./uniform/ShaderUniformValue";
export declare class ShaderProgram {
    private program;
    private vertexShader;
    private fragmentShader;
    private attributes;
    private uniforms;
    private varyings;
    constructor(gl: WebGL2RenderingContext, vertShaderSource: string, fragShaderSource: string, varyings?: string[]);
    use(gl: WebGL2RenderingContext): void;
    getProgram(): WebGLProgram;
    getFragmentShader(): WebGLShader;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    getUniform(gl: WebGL2RenderingContext, name: string): ShaderUniform;
    setUniform(gl: WebGL2RenderingContext, name: string, value: ShaderUniformValue): void;
    private createProgram;
    private compileShader;
    private createShader;
}
