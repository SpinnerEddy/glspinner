import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class GlitchMaterial extends BaseMaterial {

    private glitchCoef: number;

    constructor(shaderProgram: ShaderProgram, glitchCoef: number) {
        super(shaderProgram);
        this.glitchCoef = glitchCoef;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'glitchCoef', new ShaderUniformValue(this.glitchCoef));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setGlitchCoef(glitchCoef: number): void {
        this.glitchCoef = glitchCoef;
    }
}
