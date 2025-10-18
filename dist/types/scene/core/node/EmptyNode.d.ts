import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";
export declare class EmptyNode extends SceneNode {
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
