import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
export interface MeshOperation {
    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void;
    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void;
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}
