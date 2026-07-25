import { ShaderAttribute } from '../../webgl/gl/attribute/ShaderAttribute';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';

export interface MaterialOperation {
    use(gl: WebGL2RenderingContext, context: RendererContext): void;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void;
    cleanup(): void;
}
