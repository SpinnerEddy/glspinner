import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderPassOperation } from "../postEffect/ShaderPassOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererFlowOptions } from "./RendererFlowConstants";
export declare class PostEffectRendererFlow extends BaseSceneRendererFlow {
    private shaderPasses;
    constructor(shaderPasses: Map<string, ShaderPassOperation>, options: RendererFlowOptions);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
    dispose(): void;
}
