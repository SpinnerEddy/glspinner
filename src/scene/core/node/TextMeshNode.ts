import { ShaderUniformValue } from "../../../webgl/gl/uniform/ShaderUniformValue";
import { TextMesh } from "../../mesh/TextMesh";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";

export class TextMeshNode extends SceneNode {
    private mesh: TextMesh;

    constructor(mesh: TextMesh, id: string = ""){
        super(id);
        this.mesh = mesh;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.mesh.useMaterial(gl, context);
        this.updateUniforms(gl, context);
        this.updateMaterialParams(gl, context);
        this.mesh.draw(gl);
    }

    private updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        const modelMatrix = this.transform.getWorldMatrix();
        const viewMatrix = context.getCamera().getViewMatrix();
        const projectionMatrix = context.getCamera().getProjectionMatrix();
        const vpMatrix = projectionMatrix.multiply(viewMatrix);
        const mvpMatrix = vpMatrix.multiply(modelMatrix);
        
        let uniforms = context.getGlobalUniform();
        uniforms["mvpMatrix"] = new ShaderUniformValue(mvpMatrix);

        this.mesh.updateUniforms(gl, uniforms);
    }

    private updateMaterialParams(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.mesh.updateMaterialParams(gl, this.transform, context);
    }
}