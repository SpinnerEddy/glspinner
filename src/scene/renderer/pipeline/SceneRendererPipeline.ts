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

        let readRT: RenderTargetOperation | undefined = undefined;
        let writeRT: RenderTargetOperation | undefined = renderTargetA;

        for (const flow of this.rendererFlows) {
            const result = flow.render(gl, context, readRT, writeRT);

            readRT = result;
            writeRT = (writeRT === renderTargetA) ? renderTargetB : renderTargetA;
        }
    }
} 