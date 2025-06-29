import { BaseMaterial } from "../../material/BaseMaterial";
import { BaseMesh } from "../../mesh/BaseMesh";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";

export class MeshNode extends SceneNode{
    private mesh: BaseMesh;
    private material: BaseMaterial;

    constructor(mesh: BaseMesh, material: BaseMaterial, id: string = ""){
        super(id);
        this.mesh = mesh;
        this.material = material;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public updateUniforms(gl: WebGL2RenderingContext, context: RendererContext){
        this.mesh.updateUniforms(gl, context.getGlobalUniform());
        this.material.setUniform(gl, this.mesh.getShaderProgram(), context.getGlobalUniform());
    }

    public draw(gl: WebGL2RenderingContext): void {
        this.mesh.draw(gl);
    }
}