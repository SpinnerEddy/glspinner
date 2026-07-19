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

    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void {
        const modelMatrix = transform.getWorldMatrix();
        const invertMatrix = modelMatrix.inverse();
        const eyeDirection = context.getCamera().calculateEyeDirection();

        let uniforms = context.getGlobalUniform();
        uniforms['modelMatrix'] = new ShaderUniformValue(modelMatrix);
        uniforms['invMatrix'] = new ShaderUniformValue(invertMatrix);
        uniforms['eyeDirection'] = new ShaderUniformValue(eyeDirection);

        const phong = this.material as PhongMaterial;
        if (phong == null) return;
        if (context.getLights().length == 0) return;

        let light = context.getLights().at(0)!;
        phong.setLightUniform(gl, light);
    }

    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.setUniform(gl, context);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup();
    }
}
