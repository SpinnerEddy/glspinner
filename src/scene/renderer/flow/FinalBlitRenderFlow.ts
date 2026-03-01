import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";

export class FinalBlitRendererFlow extends BaseSceneRendererFlow {
    
    private finalBlitShaderPass: ShaderPassOperation;

    constructor(shaderPass: ShaderPassOperation) {
        super();
        this.finalBlitShaderPass = shaderPass;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        if(!this.finalBlitShaderPass) return;
        if(!outputRenderTarget) return;

        let readRT: RenderTargetOperation = inputRenderTarget;
        let writeRT: RenderTargetOperation = outputRenderTarget;

        this.finalBlitShaderPass.render(gl, context, readRT, writeRT);
    }
}