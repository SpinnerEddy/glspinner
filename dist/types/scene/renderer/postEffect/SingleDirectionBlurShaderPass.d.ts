import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { BlurMaterial } from "../../material/BlurMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class SingleDirectionBlurShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: BlurMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
