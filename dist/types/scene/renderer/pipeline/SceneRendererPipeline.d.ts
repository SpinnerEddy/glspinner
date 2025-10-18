import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";
export declare class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private rendererFlows;
    constructor();
    addFlow(rendererFlow: RendererFlowOperation): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
    dispose(): void;
}
