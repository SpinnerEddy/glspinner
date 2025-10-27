import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";
export interface SceneRendererPipelineOperation {
    addFlow(rendererFlow: RendererFlowOperation): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
}
