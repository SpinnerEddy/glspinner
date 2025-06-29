import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MaterialOperation } from "./MaterialOperation";

export abstract class BaseMaterial implements MaterialOperation {
    abstract setUniform(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram, uniforms: UniformPairs): void;
}