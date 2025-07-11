import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { RendererContext } from "../renderer/RendererContext";

export interface MeshOperation{
    updateMaterialParams(): void;
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}