import { BaseMesh } from "../../mesh/BaseMesh";
import { SceneNode } from "./SceneNode";

export class MeshNode extends SceneNode{
    private mesh: BaseMesh;

    constructor(mesh: BaseMesh ,id: string = ""){
        super(id);
        this.mesh = mesh;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public draw(gl: WebGL2RenderingContext): void {
        this.mesh.draw(gl);
    }
}