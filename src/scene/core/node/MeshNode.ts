import { BaseMesh } from "../../mesh/BaseMesh";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";

export class MeshNode extends SceneNode{
    private mesh: BaseMesh;

    constructor(mesh: BaseMesh, id: string = ""){
        super(id);
        this.mesh = mesh;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public updateMaterialParams(): void {
        this.mesh.updateMaterialParams();
    }

    public updateUniforms(gl: WebGL2RenderingContext, context: RendererContext){
        this.mesh.updateUniforms(gl, context.getGlobalUniform());
    }

    public draw(gl: WebGL2RenderingContext): void {
        this.mesh.draw(gl);
    }
}