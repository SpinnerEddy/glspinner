import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { EmptyNode } from "../../core/node/EmptyNode";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { SceneGraphUtility } from "../../core/SceneGraphUtility";

export class StandardSceneRendererFlow extends BaseSceneRendererFlow {

    private sceneGraphRoot: EmptyNode;

    constructor(sceneGraphRoot: EmptyNode) {
        super();
        this.sceneGraphRoot = sceneGraphRoot;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation | undefined, outputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined {
        if (outputRenderTarget) {
            outputRenderTarget.drawToFrameBuffer(() => {
                this.drawScene(gl, context);
            });
        }
        else {
            this.drawScene(gl, context);
        }

        return outputRenderTarget;
    }

    private drawScene(gl: WebGL2RenderingContext, context: RendererContext): void {
        SceneGraphUtility.traverse(this.sceneGraphRoot, (node) => {
            node.draw(gl, context);
        });
    }

}