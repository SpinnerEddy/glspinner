import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { Texture2D } from "../../webgl/gl/texture/Texture2D";
import { TextureSlot } from "../../webgl/gl/texture/TextureConstants";
import { TextureOperation } from "../../webgl/gl/texture/TextureOperation";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class TexturedTextMaterial extends BaseMaterial {
    private fontTexture: TextureOperation;

    constructor(shaderProgram: ShaderProgram, fontTexture: Texture2D){
        super(shaderProgram);
        this.fontTexture = fontTexture;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.fontTexture.bind(TextureSlot.FONT_ATLAS);
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(TextureSlot.FONT_ATLAS, 'int'));
    }

    cleanup(): void {
        this.fontTexture.unbind();
    }
}