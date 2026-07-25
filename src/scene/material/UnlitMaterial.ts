import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class UnlitMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        const uniforms = context.getGlobalUniform();
        for (const key in uniforms) {
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }
    }
}
