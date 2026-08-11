import { GeometryOperation } from '../../webgl/gl/geometry/GeometryOperation';
import { MaterialOperation } from '../material/MaterialOperation';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMesh } from './BaseMesh';

export class SimpleMesh extends BaseMesh {
    constructor(geometry: GeometryOperation, material: MaterialOperation) {
        super(geometry, material);
    }

    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        this.material.setUniform(gl, context, transform);
    }

    draw(gl: WebGL2RenderingContext): void {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup();
    }
}
