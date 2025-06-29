import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MeshOperation{
    getShaderProgram(): ShaderProgram;
    useShaderProgram(gl: WebGL2RenderingContext): void;
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}