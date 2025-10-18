import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { Texture2D } from "../../webgl/gl/texture/Texture2D";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class TexturedMaterial extends BaseMaterial {
    private texture;
    private texIndex;
    constructor(shaderProgram: ShaderProgram, texture: Texture2D, index: number);
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    cleanup(): void;
}
