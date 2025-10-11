import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class GrayScaleMaterial extends BaseMaterial {

    private texIndex: number;

    constructor(shaderProgram: ShaderProgram, index: number){
        super(shaderProgram);
        this.texIndex = index;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(this.texIndex, 'int'));
    }
}