import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class ComposeMaterial extends BaseMaterial {

    private bloomStrength: number;

    constructor(shaderProgram: ShaderProgram, bloomStrength: number) {
        super(shaderProgram);
        this.bloomStrength = bloomStrength;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'bloomStrength', new ShaderUniformValue(this.bloomStrength));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
        this.shaderProgram.setUniform(gl, 'brightTex', new ShaderUniformValue(TextureSlot.BLOOM_FRAME, 'int'));
    }

    setBloomStrength(bloomStrength: number): void {
        this.bloomStrength = bloomStrength;
    }
}
