import { ShaderUniformValue } from "../../../webgl/gl/uniform/ShaderUniformValue";
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

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.updateUniforms(gl, context);
        this.mesh.draw(gl, context);
    }

    private updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        const modelMatrix = this.transform.getWorldMatrix();
        const viewMatrix = context.getCamera().getViewMatrix();
        const projectionMatrix = context.getCamera().getProjectionMatrix();

        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const mvpMatrix = vpMatrix.multiply(modelMatrix);
        const invertMatrix = modelMatrix.inverse();

        let uniforms = context.getGlobalUniform();
        uniforms["mvpMatrix"] = new ShaderUniformValue(mvpMatrix);
        uniforms["invMatrix"] = new ShaderUniformValue(invertMatrix);

        this.mesh.updateUniforms(gl, uniforms);
    }
}