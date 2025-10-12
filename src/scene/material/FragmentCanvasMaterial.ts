import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";

export class FragmentCanvasMaterial extends BaseMaterial {
    
    constructor(shaderProgram: ShaderProgram){
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "time", uniforms["time"]);
        this.shaderProgram.setUniform(gl, "resolution", uniforms["resolution"]);
    }
}