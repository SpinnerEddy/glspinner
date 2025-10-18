import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { Texture2D } from "../../webgl/gl/texture/Texture2D";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class TexturedTextMaterial extends BaseMaterial {
    private fontTexture;
    private smoothness;
    private fontColor;
    constructor(shaderProgram: ShaderProgram, fontTexture: Texture2D, smoothness: number, fontColor: Float32Array);
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    cleanup(): void;
}
