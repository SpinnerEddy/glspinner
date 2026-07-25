import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class BrightMaterial extends BaseMaterial {

    private brightThreshold: number;

    constructor(shaderProgram: ShaderProgram, brightThreshold: number) {
        super(shaderProgram);
        this.brightThreshold = brightThreshold;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'brightThreshold', new ShaderUniformValue(this.brightThreshold));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setBrightThreshold(brightThreshold: number): void {
        this.brightThreshold = brightThreshold;
    }
}
