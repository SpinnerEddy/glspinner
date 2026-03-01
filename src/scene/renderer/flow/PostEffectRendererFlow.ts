import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";

export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    
    private shaderPasses: Map<string, ShaderPassOperation>;

    constructor(shaderPasses: Map<string, ShaderPassOperation>) {
        super();
        this.shaderPasses = shaderPasses;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        if(!this.shaderPasses || this.shaderPasses.size === 0) return;
        if(!outputRenderTarget) return;

        let readRT: RenderTargetOperation = inputRenderTarget;
        let writeRT: RenderTargetOperation = outputRenderTarget;

        const passes = Array.from(this.shaderPasses.values()).filter(pass => pass.getEffectEnabled());

        for (let i = 0; i < passes.length; i++) {

            const target = writeRT;

            passes[i].render(gl, context, readRT, target);

            const temp = readRT;
            readRT = writeRT;
            writeRT = temp;
        }
    }
}