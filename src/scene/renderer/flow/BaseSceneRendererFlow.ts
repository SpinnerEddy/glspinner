import { RendererContext } from "../RendererContext";
import { RendererFlowOperation } from "./RendererFlowOperation";

export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    abstract init(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract render(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract dispose(): void
}