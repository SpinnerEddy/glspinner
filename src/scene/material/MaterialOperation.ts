import { ShaderAttribute } from "../../webgl/gl/attribute/ShaderAttribute";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MaterialOperation{
    use(gl: WebGL2RenderingContext): void;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}