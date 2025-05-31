import { BaseMesh } from "../../mesh/BaseMesh";
import { RendererContext } from "../../renderer/RendererContext";
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

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.mesh.updateUniforms(gl, context.getGlobalUniform());
        this.mesh.draw(gl);
    }
}