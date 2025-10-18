import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { GrayScaleMaterial } from "../../material/GrayScaleMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class GrayScaleShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: GrayScaleMaterial, resolution: [number, number]);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
