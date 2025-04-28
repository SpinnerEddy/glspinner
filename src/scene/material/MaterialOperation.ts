import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";

export interface MaterialOperation{
    use(): void;
    setUniform(uniforms: UniformPairs): void;
}