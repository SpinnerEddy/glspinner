import { FinalBlitRendererFlow } from "../flow/FinalBlitRenderFlow";
import { PostEffectRendererFlow } from "../flow/PostEffectRendererFlow";
import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";

export interface SceneRendererPipelineOperation {
    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void;
    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void;
    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
}