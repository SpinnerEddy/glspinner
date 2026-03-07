import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";

export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    
    private shaderPass: ShaderPassOperation;

    constructor(shaderPass: ShaderPassOperation) {
        super();
        this.shaderPass = shaderPass;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        if (!this.shaderPass.getEffectEnabled()) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, inputRenderTarget.getFrameBuffer());
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, outputRenderTarget.getFrameBuffer());

            gl.blitFramebuffer(
                0, 0, inputRenderTarget.getSize()[0], inputRenderTarget.getSize()[1],
                0, 0, outputRenderTarget.getSize()[0], outputRenderTarget.getSize()[1],
                gl.COLOR_BUFFER_BIT, gl.NEAREST);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return;
        }

        let readRT: RenderTargetOperation = inputRenderTarget;
        let writeRT: RenderTargetOperation = outputRenderTarget;

        this.shaderPass.render(gl, context, readRT, writeRT);
    }
}