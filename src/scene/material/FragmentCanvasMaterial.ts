import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";

export class FragmentCanvasMaterial extends BaseMaterial{
    constructor(shaderProgram: ShaderProgram){
        super(shaderProgram);
    }

    setUniform(uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(key, uniforms[key]);
        }
    }
}