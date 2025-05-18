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

    public draw(gl: WebGL2RenderingContext): void {
        this.root.draw(gl);
    }

    public getGraph(): SceneNode {
        return this.root;
    }
}