import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { FrameBufferTexturedMaterial } from "../../material/FrameBufferTexturedMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class FinalBlitShaderPass extends BaseShaderPass {

    private isUsePrevFrame: boolean;

    constructor(gl: WebGL2RenderingContext, material: FrameBufferTexturedMaterial, resolution: [number, number], isUsePrevFrame: boolean = false){
        super(gl, material, resolution);
        this.isUsePrevFrame = isUsePrevFrame;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        if(this.isUsePrevFrame)
        {
            return this.drawWithPrev(gl, context, inputRenderTarget, isBlit);
        }
        else
        {
            return this.drawCurrent(gl, context, inputRenderTarget, isBlit);
        }
    }

    private drawCurrent(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(TextureSlot.CURRENT_FRAME);
        this.draw(gl, context, isBlit);
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

    private drawWithPrev(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        const prevRenderTarget = context.getPrevRenderTarget();

        inputRenderTarget!.bind(TextureSlot.CURRENT_FRAME);
        prevRenderTarget?.bind(TextureSlot.PREV_FRAME);
        this.draw(gl, context, isBlit);
        prevRenderTarget?.unbind();
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

}