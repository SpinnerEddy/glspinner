import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { EmptyNode } from "../../core/node/EmptyNode";
import { RendererFlowOptions } from "./RendererFlowConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { SceneGraphUtility } from "../../core/SceneGraphUtility";

export class StandardSceneRendererFlow extends BaseSceneRendererFlow {

    private sceneGraphRoot: EmptyNode;

    constructor(sceneGraphRoot: EmptyNode, options: RendererFlowOptions = { useFbo: false }) {
        super(options);
        this.sceneGraphRoot = sceneGraphRoot;
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

    private drawScene(gl: WebGL2RenderingContext, context: RendererContext): void {
        SceneGraphUtility.traverse(this.sceneGraphRoot, (node) => {
            node.draw(gl, context);
        });
    }

}