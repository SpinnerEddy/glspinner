import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { FrameBufferTexturedMaterial } from "../../material/FrameBufferTexturedMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class FinalBlitShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: FrameBufferTexturedMaterial, resolution: [number, number]);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
    private drawCurrent;
}
