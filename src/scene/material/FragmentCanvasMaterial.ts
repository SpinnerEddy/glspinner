import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { UniformPairs } from '../../webgl/gl/uniform/ShaderUniformConstants';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class FragmentCanvasMaterial extends BaseMaterial {

    private customUniforms: UniformPairs = {};

    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));

        Object.entries(this.customUniforms).forEach(([key, value]) => {
            this.shaderProgram.setUniform(gl, key, value);
        });
    }

    setCustomUniform(key: string, value: ShaderUniformValue): void {
        this.customUniforms[key] = value;
    }
}
