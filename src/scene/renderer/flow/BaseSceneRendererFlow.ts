import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { EmptyNode } from "../../core/node/EmptyNode";
import { SceneGraphUtility } from "../../core/SceneGraphUtility";
import { RendererContext } from "../RendererContext";
import { RendererFlowOperation } from "./RendererFlowOperation";

export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    
    protected sceneGraphRoot: EmptyNode;
    protected renderTarget: RenderTargetOperation | undefined;

    constructor(sceneGraphRoot: EmptyNode) { 
        this.sceneGraphRoot = sceneGraphRoot;
    }

    abstract render(gl: WebGL2RenderingContext, context: RendererContext): RenderTargetOperation | undefined;
    abstract dispose(): void

    protected drawScene(gl: WebGL2RenderingContext, context: RendererContext): void {
        SceneGraphUtility.traverse(this.sceneGraphRoot, (node) => {
            node.draw(gl, context);
        });
    }
}