import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { EmptyNode } from "../../core/node/EmptyNode";
import { RendererFlowOptions } from "./RendererFlowConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
export declare class StandardSceneRendererFlow extends BaseSceneRendererFlow {
    private sceneGraphRoot;
    constructor(sceneGraphRoot: EmptyNode, options?: RendererFlowOptions);
    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
    dispose(): void;
    private drawScene;
}
