import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { GlitchMaterial } from "../../material/GlitchMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class GlitchShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: GlitchMaterial, resolution: [number, number]);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
