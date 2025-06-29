import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MaterialOperation{
    setUniform(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram, uniforms: UniformPairs): void;
}