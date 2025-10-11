import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";

export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private rendererFlows: RendererFlowOperation[];

    constructor() {
        this.rendererFlows = [];
    }

    addFlow(rendererFlow: RendererFlowOperation): void {
        this.rendererFlows.push(rendererFlow);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext): void {
        let currentRenderTarget: RenderTargetOperation | undefined = undefined;

        for (const flow of this.rendererFlows) {
            currentRenderTarget = flow.render(gl, context, currentRenderTarget);
        }
    }

    dispose(): void {
        this.rendererFlows.forEach(flow => flow.dispose());
    }

} 