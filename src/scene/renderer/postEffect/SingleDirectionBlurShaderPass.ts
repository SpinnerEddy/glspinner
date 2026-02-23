import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { BlurMaterial } from "../../material/BlurMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class SingleDirectionBlurShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: BlurMaterial){
        super(gl, material);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        const texture = inputRenderTarget.getColorTexture(0);

        gl.activeTexture(gl.TEXTURE0 + TextureSlot.CURRENT_FRAME);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        this.draw(gl, context, outputRenderTarget);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}