import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";
import { RendererFlowOperation } from "./RendererFlowOperation";

export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined, outputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
}