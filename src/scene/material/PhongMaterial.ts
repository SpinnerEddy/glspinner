import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { LightParams, LightType } from '../light/LightConstants';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class PhongMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        const modelMatrix = transform.getWorldMatrix();
        const invertMatrix = modelMatrix.inverse();
        const eyeDirection = context.getCamera().calculateEyeDirection();

        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(modelMatrix));
        this.shaderProgram.setUniform(gl, 'invMatrix', new ShaderUniformValue(invertMatrix));
        this.shaderProgram.setUniform(gl, 'eyeDirection', new ShaderUniformValue(eyeDirection));

        if (context.getLights().length == 0) return;

        const light = context.getLights().at(0)!;
        this.setLightUniform(gl, light);
    }

    private setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void {
        if (light.lightType == LightType.Directional) {
            this.shaderProgram.setUniform(gl, 'lightDirection', new ShaderUniformValue(light.direction));
            this.shaderProgram.setUniform(gl, 'lightColor', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, 'lightType', new ShaderUniformValue(light.lightType, 'int'));
            this.shaderProgram.setUniform(gl, 'intensity', new ShaderUniformValue(light.intensity));
        } else if (light.lightType == LightType.Point) {
            this.shaderProgram.setUniform(gl, 'lightPosition', new ShaderUniformValue(light.position));
            this.shaderProgram.setUniform(gl, 'lightColor', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, 'lightType', new ShaderUniformValue(light.lightType, 'int'));
            this.shaderProgram.setUniform(gl, 'intensity', new ShaderUniformValue(light.intensity));
        }
    }
}
