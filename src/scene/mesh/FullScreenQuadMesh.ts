import { Rectangle } from '../../webgl/gl/geometry/Rectangle';
import { MaterialOperation } from '../material/MaterialOperation';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMesh } from './BaseMesh';

export class FullScreenQuadMesh extends BaseMesh {
    constructor(geometry: Rectangle, material: MaterialOperation) {
        super(geometry, material);
    }

    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        this.material.setUniform(gl, context, transform);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}
