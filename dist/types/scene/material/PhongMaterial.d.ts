import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { LightParams } from "../light/LightConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class PhongMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void;
}
