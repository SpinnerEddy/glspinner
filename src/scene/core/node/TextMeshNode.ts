import { TextMesh } from '../../mesh/TextMesh';
import { RenderTagConstants } from '../../renderer/definition/RenderTag';
import { RendererContext } from '../../renderer/RendererContext';
import { SceneNode } from './SceneNode';

export class TextMeshNode extends SceneNode {
    private mesh: TextMesh;

    constructor(mesh: TextMesh, id: string = '') {
        super(id);
        this.mesh = mesh;
        this.renderTag = RenderTagConstants.OVERLAY;
    }

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.mesh.useMaterial(gl, context);
        this.mesh.updateUniforms(gl, context, this.transform);
        this.mesh.draw(gl);
    }
}
