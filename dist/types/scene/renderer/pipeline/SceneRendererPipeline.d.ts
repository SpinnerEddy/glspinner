import { FinalBlitRendererFlow } from "../flow/FinalBlitRenderFlow";
import { PostEffectRendererFlow } from "../flow/PostEffectRendererFlow";
import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";
export declare class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private sceneRendererFlows;
    private postEffectFlows;
    private finalBlitFlow;
    constructor();
    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void;
    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void;
    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
    private renderScene;
}
