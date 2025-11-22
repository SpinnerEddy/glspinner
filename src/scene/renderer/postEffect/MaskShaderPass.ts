import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { MaskMaterial } from "../../material/MaskMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";  

export class MaskShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: MaskMaterial){
        super(gl, material);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(TextureSlot.CURRENT_FRAME);
        outputRenderTarget = this.draw(gl, context, outputRenderTarget, isBlit);
        inputRenderTarget!.unbind();

        return outputRenderTarget;
    }

}