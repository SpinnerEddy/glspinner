import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
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
        let renderTargetA = context.getRenderTargetFromPool(RenderTargetSlot.RENDER_TARGET_A);
        let renderTargetB = context.getRenderTargetFromPool(RenderTargetSlot.RENDER_TARGET_B);

        let readRT: RenderTargetOperation = renderTargetB!;
        let writeRT: RenderTargetOperation = renderTargetA!;
        
        for (let i = 0; i < this.rendererFlows.length - 1; i++) {
            this.rendererFlows[i].render(gl, context, readRT, writeRT);

            const temp = readRT;
            readRT = writeRT;
            writeRT = temp;
        }

        let screenTarget = context.getScreenRenderTarget();
        this.rendererFlows.at(-1)?.render(gl, context, readRT, screenTarget);
    }
} 