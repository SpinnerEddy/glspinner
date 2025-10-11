import { BaseSceneRendererFlow } from "../flow/BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { SceneRendererPipelineOperation } from "./SceneRendererPipelineOperation";

export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private rendererFlows: BaseSceneRendererFlow[];

    constructor() {
        this.rendererFlows = [];
    }

    addFlow(rendererFlow: BaseSceneRendererFlow): void {
        this.rendererFlows.push(rendererFlow);
    }

    init(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.rendererFlows.forEach(flow => flow.init(gl, context));
    }

    render(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.rendererFlows.forEach(flow => flow.render(gl, context));
    }

    dispose(): void {
        this.rendererFlows.forEach(flow => flow.dispose());
    }

} 