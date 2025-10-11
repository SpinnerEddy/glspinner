import { BaseSceneRendererFlow } from "../flow/BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";

export interface SceneRendererPipelineOperation {
    addFlow(rendererFlow: BaseSceneRendererFlow): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
    dispose(): void;
}