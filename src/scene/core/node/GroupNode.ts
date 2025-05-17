import { SceneNode } from "./SceneNode";

export class GroupNode extends SceneNode{
    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());

        for (const child of this.children) {
            child.update();
        }
    }

    public draw(gl: WebGL2RenderingContext): void {
        for (const child of this.children) {
            child.draw(gl);
        }
    }
}