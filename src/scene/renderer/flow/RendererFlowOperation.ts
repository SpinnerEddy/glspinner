import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";

export interface RendererFlowOperation {
    render(gl: WebGL2RenderingContext, context: RendererContext): RenderTargetOperation | undefined;
    dispose(): void;
}