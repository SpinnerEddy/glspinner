import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { FrameBufferTexturedMaterial } from "../../material/FrameBufferTexturedMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class FinalBlitShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: FrameBufferTexturedMaterial, resolution: [number, number]){
        super(gl, material, resolution);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        return this.drawCurrent(gl, context, inputRenderTarget, isBlit);
    }

    private drawCurrent(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(TextureSlot.CURRENT_FRAME);
        this.draw(gl, context, isBlit);
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

}