import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
export declare class FinalBlitRendererFlow extends BaseSceneRendererFlow {
    private finalBlitShaderPass;
    constructor(shaderPass: ShaderPassOperation);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}
