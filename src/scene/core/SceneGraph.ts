import { RendererContext } from "../renderer/RendererContext";
import { EmptyNode } from "./node/EmptyNode";
import { SceneNode } from "./node/SceneNode";

export class SceneGraph{
    private readonly root: EmptyNode;

    constructor(){
        this.root = new EmptyNode();
    }

    public update(): void {
        this.root.update();
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.root.draw(gl, context);
    }

    public getGraph(): SceneNode {
        return this.root;
    }
}