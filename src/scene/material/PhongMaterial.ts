import { Vector4 } from '../../math/vector/Vector4';
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

        const lights = context.getLights();
        this.setLightUniforms(gl, lights);
    }

    private setLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        this.setDirectionalLightUniforms(gl, lights);
        this.setPointLightUniforms(gl, lights);
        this.setAmbientLightUniform(gl, lights);
    }

    private setDirectionalLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const directionalLights = lights.filter((light) => light.lightType === LightType.Directional);
        if (directionalLights.length === 0) return;

        this.shaderProgram.setUniform(gl, 'directionalLightCounts', new ShaderUniformValue(directionalLights.length, 'int'));
        for (let i = 0; i < directionalLights.length; i++) {
            const light = directionalLights[i];
            const commonUniformStr = `directionalLights[${i}]`; 
            this.shaderProgram.setUniform(gl, commonUniformStr + `.direction`, new ShaderUniformValue(light.direction));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.color', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.intensity', new ShaderUniformValue(light.intensity));
        }
    }

    private setPointLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const pointLights = lights.filter((light) => light.lightType === LightType.Point);
        if (pointLights.length === 0) return;
        
        this.shaderProgram.setUniform(gl, 'pointLightCounts', new ShaderUniformValue(pointLights.length, 'int'));
        for (let i = 0; i < pointLights.length; i++) {
            const light = pointLights[i];
            const commonUniformStr = `pointLights[${i}]`; 
            this.shaderProgram.setUniform(gl, commonUniformStr + `.position`, new ShaderUniformValue(light.position));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.color', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.intensity', new ShaderUniformValue(light.intensity));
        }
    }

    private setAmbientLightUniform(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const ambientLights = lights.filter((light) => light.lightType === LightType.Ambient);
        if (ambientLights.length === 0) return;

        const calculatedAmbientColor = new Vector4(0, 0, 0, 0);
        for (const light of ambientLights) {
            calculatedAmbientColor.add(light.color.toVector4().multiply(light.intensity), calculatedAmbientColor);
        }

        this.shaderProgram.setUniform(gl, 'ambientLightColor', new ShaderUniformValue(calculatedAmbientColor));
    }
}
