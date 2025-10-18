import { RendererContext } from "../renderer/RendererContext";
import { SceneNode } from "./node/SceneNode";
export declare class SceneGraph {
    private readonly root;
    constructor();
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    getGraph(): SceneNode;
}
