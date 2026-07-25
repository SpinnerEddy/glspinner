import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { TextureSlot } from '../../webgl/gl/texture/TextureConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class RGBShiftMaterial extends BaseMaterial {

    private shiftOffset: number;

    constructor(shaderProgram: ShaderProgram, shiftOffset: number) {
        super(shaderProgram);
        this.shiftOffset = shiftOffset;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'shiftOffset', new ShaderUniformValue(this.shiftOffset));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setShiftOffset(shiftOffset: number): void {
        this.shiftOffset = shiftOffset;
    }
}
