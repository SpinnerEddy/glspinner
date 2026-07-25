import { GeometryOperation } from '../../webgl/gl/geometry/GeometryOperation';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { MaterialOperation } from '../material/MaterialOperation';
import { PhongMaterial } from '../material/PhongMaterial';
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
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup();
    }
}
