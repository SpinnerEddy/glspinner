import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MaterialOperation{
    use(gl: WebGL2RenderingContext): void;
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}