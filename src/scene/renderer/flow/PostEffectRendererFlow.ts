import { RendererContext } from "../RendererContext";
import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";

export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    
    init(gl: WebGL2RenderingContext, context: RendererContext): void {
        throw new Error("Method not implemented.");
    }

    render(gl: WebGL2RenderingContext, context: RendererContext): void {
        throw new Error("Method not implemented.");
    }

     dispose(): void {
        throw new Error("Method not implemented.");
     }

}