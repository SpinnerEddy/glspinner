import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RenderTagConstants } from "../definition/RenderTag";
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
        const rtRegistry = context.getRenderTargetRegistry();
        let renderTargetA = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.CURRENT_FRAME);
        let renderTargetB = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.TEMP_FRAME_BUFFER);

        let readRT: RenderTargetOperation = renderTargetB!;
        let writeRT: RenderTargetOperation = renderTargetA!;
        
        for (let i = 0; i < this.rendererFlows.length; i++) {
            const isLast = i === this.rendererFlows.length - 1;
            const screenTarget = isLast ? rtRegistry.getScreenRenderTarget() : writeRT;

            context.setActivateRenderTag(RenderTagConstants.OPAQUE);
            this.rendererFlows[i].render(gl, context, readRT, screenTarget);

            context.setActivateRenderTag(RenderTagConstants.OVERLAY);
            this.rendererFlows[i].render(gl, context, readRT, screenTarget);

            if (!isLast){
                const temp = readRT;
                readRT = writeRT;
                writeRT = temp;
            }
        }
    }
} 