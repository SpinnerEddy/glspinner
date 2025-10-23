import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { TextureSlot } from "../../webgl/gl/texture/TextureConstants";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class ComposeMaterial extends BaseMaterial {
    
    constructor(shaderProgram: ShaderProgram) {
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "bloomStrength", uniforms["bloomStrength"]);
        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
        this.shaderProgram.setUniform(gl, "brightTex", new ShaderUniformValue(TextureSlot.BLOOM_FRAME, 'int'));
    }
}