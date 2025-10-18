import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";
export declare class GroupNode extends SceneNode {
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
