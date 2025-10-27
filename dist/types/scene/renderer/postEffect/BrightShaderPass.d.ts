import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { BrightMaterial } from "../../material/BrightMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class BrightShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: BrightMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
