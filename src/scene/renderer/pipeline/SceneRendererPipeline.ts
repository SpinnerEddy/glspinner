import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RenderTag, RenderTagConstants } from "../definition/RenderTag";
import { FinalBlitRendererFlow } from "../flow/FinalBlitRenderFlow";
import { PostEffectRendererFlow } from "../flow/PostEffectRendererFlow";
import { RendererFlowOperation } from "../flow/RendererFlowOperation";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";

export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    
    private sceneRendererFlows: RendererFlowOperation[];
    private postEffectFlows: RendererFlowOperation[];
    private finalBlitFlow: RendererFlowOperation = {
        render: () => { /* 何もしない */ },
        isEnabled: () => { return false; }
    };

    constructor() {
        this.sceneRendererFlows = [];
        this.postEffectFlows = [];
    }

    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void {
        this.sceneRendererFlows.push(rendererFlow);
    }

    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void {
        this.postEffectFlows.push(rendererFlow);
    }

    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void {
        this.finalBlitFlow = rendererFlow;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext): void {
        const rtRegistry = context.getRenderTargetRegistry();

        let readRT: RenderTargetOperation = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.TEMP_FRAME_BUFFER)!;
        let writeRT: RenderTargetOperation = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.CURRENT_FRAME)!;
        let screenTarget = writeRT;

        this.renderScene(gl, context, [RenderTagConstants.OPAQUE], this.sceneRendererFlows, readRT, screenTarget);

        [readRT, writeRT] = [writeRT, readRT];

        const activePostEffects = this.postEffectFlows.filter(flow => flow.isEnabled());
        for (const postEffect of activePostEffects) {
            postEffect.render(gl, context, readRT, writeRT);
            [readRT, writeRT] = [writeRT, readRT];
        }

        screenTarget = rtRegistry.getScreenRenderTarget();
        this.finalBlitFlow.render(gl, context, readRT, screenTarget);

        this.renderScene(gl, context, [RenderTagConstants.OVERLAY], this.sceneRendererFlows, readRT, screenTarget);
    }

    private renderScene(
        gl: WebGL2RenderingContext, 
        context: RendererContext,
        tags: RenderTag[],
        sceneRendererFlows: RendererFlowOperation[],
        readRT: RenderTargetOperation,
        writeRT: RenderTargetOperation)
    {
        for (const tag of tags) {
            context.setActivateRenderTag(tag);
            for(const flow of sceneRendererFlows){
                flow.render(gl, context, readRT, writeRT);
            }
        }
    }
} 