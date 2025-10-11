import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { BaseSceneRendererFlow } from "../flow/BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";

export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private rendererFlows: BaseSceneRendererFlow[];

    constructor() {
        this.rendererFlows = [];
    }

    addFlow(rendererFlow: BaseSceneRendererFlow): void {
        this.rendererFlows.push(rendererFlow);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext): void {
        let inputRenderTarget: RenderTargetOperation | undefined = undefined;

        for (const flow of this.rendererFlows) {
            inputRenderTarget = flow.render(gl, context, inputRenderTarget);
        }
    }

    dispose(): void {
        this.rendererFlows.forEach(flow => flow.dispose());
    }

} 