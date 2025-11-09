import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";
export declare class GlitchMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}
