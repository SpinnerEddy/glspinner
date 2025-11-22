import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { MaskMaterial } from "../../material/MaskMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class MaskShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: MaskMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
