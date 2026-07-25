import { Color } from '../../color/Color';
import { Vector3 } from '../../math/vector/Vector3';
import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class GouraudMaterial extends BaseMaterial {
    private lightDirection: Vector3;
    private eyeDirection: Vector3;
    private ambientColor: Color;

    constructor(shaderProgram: ShaderProgram, lightDirection: Vector3, eyeDirection: Vector3, ambientColor: Color) {
        super(shaderProgram);
        this.lightDirection = lightDirection;
        this.eyeDirection = eyeDirection;
        this.ambientColor = ambientColor;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        const modelMatrix = transform.getWorldMatrix();
        const invertMatrix = modelMatrix.inverse();

        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(modelMatrix));
        this.shaderProgram.setUniform(gl, 'invMatrix', new ShaderUniformValue(invertMatrix));
        this.shaderProgram.setUniform(gl, 'lightDirection', new ShaderUniformValue(this.lightDirection));
        this.shaderProgram.setUniform(gl, 'eyeDirection', new ShaderUniformValue(this.eyeDirection));
        this.shaderProgram.setUniform(gl, 'ambientColor', new ShaderUniformValue(this.ambientColor.toVector4()));
    }
    
    setLightDirection(lightDirection: Vector3): void {
        this.lightDirection = lightDirection;
    }

    setEyeDirection(eyeDirection: Vector3): void {
        this.eyeDirection = eyeDirection;
    }

    setAmbientColor(ambientColor: Color): void {
        this.ambientColor = ambientColor;
    }
}
