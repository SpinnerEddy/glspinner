import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class MosaicMaterial extends BaseMaterial {

    private texIndex: number;

    constructor(shaderProgram: ShaderProgram, index: number){
        super(shaderProgram);
        this.texIndex = index;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "mosaicSize", uniforms["mosaicSize"]);
        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(this.texIndex, 'int'));
    }
}