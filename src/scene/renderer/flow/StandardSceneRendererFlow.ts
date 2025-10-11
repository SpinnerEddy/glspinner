import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { EmptyNode } from "../../core/node/EmptyNode";
import { RendererFlowOptions } from "./RendererFlowConstants";
import { RenderTarget } from "../../../webgl/gl/fbo/RenderTarget";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";

export class StandardSceneRendererFlow extends BaseSceneRendererFlow {

    constructor(sceneGraphRoot: EmptyNode, options: RendererFlowOptions = { useFbo: false }) {
        super(sceneGraphRoot);
        if (!options.useFbo) return;

        this.renderTarget = new RenderTarget(options.gl!, [options.resolution!.width, options.resolution!.height]);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined {
        if (this.renderTarget) {
            this.renderTarget.drawToFrameBuffer(() => {
                this.drawScene(gl, context);
            });
        }
        else {
            this.drawScene(gl, context);
        }

        return this.renderTarget;
    }

    dispose(): void {
        if (this.renderTarget) {
            this.renderTarget.dispose();
            this.renderTarget = undefined;
        }
    }

}