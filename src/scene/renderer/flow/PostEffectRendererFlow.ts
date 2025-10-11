import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";

export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    
    render(gl: WebGL2RenderingContext, context: RendererContext): RenderTargetOperation | undefined {
        throw new Error("Method not implemented.");
    }

     dispose(): void {
        throw new Error("Method not implemented.");
     }

}