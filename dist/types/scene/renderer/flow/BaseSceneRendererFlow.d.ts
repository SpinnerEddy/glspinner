import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";
import { RendererFlowOptions } from "./RendererFlowConstants";
import { RendererFlowOperation } from "./RendererFlowOperation";
export declare abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    protected renderTarget: RenderTargetOperation | undefined;
    constructor(options?: RendererFlowOptions);
    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
    abstract dispose(): void;
}
