import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { TextureOperation } from "../../webgl/gl/texture/TextureOperation";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class FrameBufferTexturedMaterial extends BaseMaterial {
    private texture: TextureOperation;
    private texIndex: number;

    constructor(shaderProgram: ShaderProgram, texture: TextureOperation, index: number){
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

    cleanup(gl: WebGL2RenderingContext): void {
        this.texture.unbind();
    }
}