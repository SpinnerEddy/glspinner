import { BaseSceneRendererFlow } from "./BaseSceneRendererFlow";
import { RendererContext } from "../RendererContext";

export class StandardSceneRendererFlow extends BaseSceneRendererFlow {
    
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