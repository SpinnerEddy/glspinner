import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";
import { EmptyNode } from "../../core/node/EmptyNode";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
export declare class StandardSceneRendererFlow extends BaseSceneRendererFlow {
    private sceneGraphRoot;
    constructor(sceneGraphRoot: EmptyNode);
    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}
