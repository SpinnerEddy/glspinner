import { RendererContext } from "../RendererContext";

export interface RendererFlowOperation {
    init(gl: WebGL2RenderingContext, context: RendererContext): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
    dispose(): void;
}