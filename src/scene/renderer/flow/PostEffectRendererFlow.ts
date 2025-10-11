import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererFlowOptions } from "./RendererFlowConstants";

export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    
    private shaderPasses: ShaderPassOperation[];

    constructor(shaderPasses: ShaderPassOperation[], options: RendererFlowOptions) {
        super(options);
        this.shaderPasses = shaderPasses;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined {
        let currentRenderTarget: RenderTargetOperation | undefined = inputRenderTarget;

        for (const pass of this.shaderPasses) {
            currentRenderTarget = pass.render(gl, context, currentRenderTarget!, pass == this.shaderPasses[this.shaderPasses.length - 1]);
        }

        return currentRenderTarget;
    }

     dispose(): void {
        
     }

}