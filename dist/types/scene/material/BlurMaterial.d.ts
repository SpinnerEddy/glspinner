import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";
export declare class BlurMaterial extends BaseMaterial {
    private isVertical;
    private blurCoefficients;
    constructor(shaderProgram: ShaderProgram, isVertical: boolean, blueRange?: number);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}
