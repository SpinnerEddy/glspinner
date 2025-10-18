import { UniformType } from "./ShaderUniformConstants";
export declare class ShaderUniform {
    private gl;
    private location;
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, uniformName: string);
    setUniform(value: number | number[] | Float32Array | Int32Array, type: UniformType): void;
}
