import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
export declare class PostEffectRendererFlow extends BaseSceneRendererFlow {
    private shaderPasses;
    constructor(shaderPasses: Map<string, ShaderPassOperation>);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined, outputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
}
