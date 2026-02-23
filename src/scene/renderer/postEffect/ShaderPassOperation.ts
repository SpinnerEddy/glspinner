import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";

export interface ShaderPassOperation {
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}