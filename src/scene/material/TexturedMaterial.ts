import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { Texture2D } from "../../webgl/gl/texture/Texture2D";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class TexturedMaterial extends BaseMaterial {
    private texture: Texture2D;
    private texIndex: number;

    constructor(shaderProgram: ShaderProgram, texture: Texture2D, index: number){
        super(shaderProgram);
        this.texture = texture;
        this.texIndex = index;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        this.texture.bind(this.texIndex);

        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(this.texIndex, 'int'));
    }

    onUpdateFinished(gl: WebGL2RenderingContext): void {
        this.texture.unbind();
    }
}