import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class MosaicMaterial extends BaseMaterial {

    private mosaicSize: number;

    constructor(shaderProgram: ShaderProgram, mosaicSize: number) {
        super(shaderProgram);
        this.mosaicSize = mosaicSize;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'mosaicSize', new ShaderUniformValue(this.mosaicSize));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setMosaicSize(mosaicSize: number): void {
        this.mosaicSize = mosaicSize;
    }
}
