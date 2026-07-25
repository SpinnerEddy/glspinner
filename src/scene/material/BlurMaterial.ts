import { MathUtility } from '../../math/MathUtility';
import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class BlurMaterial extends BaseMaterial {
    private isVertical: boolean;
    private blurCoefficients: Float32Array;
    private blurStrength: number;
    private texResolution: [number, number];

    constructor(shaderProgram: ShaderProgram, isVertical: boolean, blurStrength: number, texResolution: [number, number], blurRange: number = 10.0) {
        super(shaderProgram);
        this.isVertical = isVertical;
        this.blurCoefficients = MathUtility.calculateGaussianCoefficients(blurRange, 32);
        this.blurStrength = blurStrength;
        this.texResolution = texResolution;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'blurDirection', new ShaderUniformValue(this.isVertical ? 1 : 0, 'int'));
        this.shaderProgram.setUniform(gl, 'gCoefficients', new ShaderUniformValue(this.blurCoefficients));
        this.shaderProgram.setUniform(gl, 'texResolution', new ShaderUniformValue(this.texResolution));
        this.shaderProgram.setUniform(gl, 'blurStrength', new ShaderUniformValue(this.blurStrength));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setBlurStrength(blurStrength: number): void {
        this.blurStrength = blurStrength;
    }

    setTexResolution(texResolution: [number, number]): void {
        this.texResolution = texResolution;
    }
}
