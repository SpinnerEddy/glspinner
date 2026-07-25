import { ShaderUniformValue } from '../../../webgl/gl/uniform/ShaderUniformValue';
import { BaseMesh } from '../../mesh/BaseMesh';
import { RenderTagConstants } from '../../renderer/definition/RenderTag';
import { RendererContext } from '../../renderer/RendererContext';
import { SceneNode } from './SceneNode';

export class MeshNode extends SceneNode {
    private mesh: BaseMesh;

    constructor(mesh: BaseMesh, id: string = '') {
        super(id);
        this.mesh = mesh;
        this.renderTag = RenderTagConstants.OPAQUE;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.mesh.useMaterial(gl, context);
        this.updateUniforms(gl, context);
        this.mesh.draw(gl);
    }

    private updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        const modelMatrix = this.transform.getWorldMatrix();

        context.updateGlobalUniform('modelMatrix', new ShaderUniformValue(modelMatrix));

        this.mesh.updateUniforms(gl, context, this.transform);
    }
}
