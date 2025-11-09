import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { LightParams } from "../light/LightConstants";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";
export declare class PhongMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void;
}
