import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { MosaicMaterial } from "../../material/MosaicMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class MosaicShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: MosaicMaterial, resolution: [number, number]);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
