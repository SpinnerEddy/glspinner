import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MeshOperation{
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}