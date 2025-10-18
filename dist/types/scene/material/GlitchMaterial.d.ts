import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class GlitchMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}
