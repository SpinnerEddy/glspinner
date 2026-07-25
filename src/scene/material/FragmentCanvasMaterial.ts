import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export class FragmentCanvasMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
        shaderProgram.getFragmentShader();
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        const uniforms = context.getGlobalUniform();
        this.shaderProgram.setUniform(gl, 'modelMatrix', uniforms['modelMatrix']);
    }
}
