import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { ComposeMaterial } from "../../material/ComposeMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class ComposeShaderPass extends BaseShaderPass {

    private bloomTexture: WebGLTexture | undefined = undefined;

    constructor(gl: WebGL2RenderingContext, material: ComposeMaterial){
        super(gl, material);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        const texture = inputRenderTarget.getColorTexture(0);

        gl.activeTexture(gl.TEXTURE0 + TextureSlot.CURRENT_FRAME);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        if (this.bloomTexture){
            gl.activeTexture(gl.TEXTURE0 + TextureSlot.BLOOM_FRAME);
            gl.bindTexture(gl.TEXTURE_2D, this.bloomTexture!);
        }

        this.draw(gl, context, outputRenderTarget);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    setBloomTexture(bloomFrame: RenderTargetOperation): void {
        this.bloomTexture = bloomFrame.getColorTexture(0);
    }

}