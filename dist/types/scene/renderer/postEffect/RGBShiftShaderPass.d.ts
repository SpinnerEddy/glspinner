import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RGBShiftMaterial } from "../../material/RGBShiftMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class RGBShiftShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: RGBShiftMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
