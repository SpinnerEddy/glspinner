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

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined, outputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined {
        if(!this.shaderPasses || this.shaderPasses.size === 0) return;
        if(!outputRenderTarget) return;

        let currentRenderTarget: RenderTargetOperation | undefined = inputRenderTarget;

        let passIndex = 0;
        for (const pass of this.shaderPasses.values()) {
            
            if(!pass.getEffectEnabled()) {
                passIndex++;
                continue;
            }


            currentRenderTarget = pass.render(gl, context, currentRenderTarget!, outputRenderTarget!, passIndex === this.shaderPasses.size - 1);
            passIndex++;
        }

        return currentRenderTarget;
    }
}