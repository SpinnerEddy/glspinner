import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { GlitchMaterial } from "../../material/GlitchMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class GlitchShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: GlitchMaterial){
        super(gl, material);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(TextureSlot.CURRENT_FRAME);
        outputRenderTarget = this.draw(gl, context, outputRenderTarget, isBlit);
        inputRenderTarget!.unbind();

        return outputRenderTarget;
    }

}