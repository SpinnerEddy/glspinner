import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";

export class SimpleMaterial extends BaseMaterial{
    setUniform(gl: WebGL2RenderingContext, shaderProgram: ShaderProgram, uniforms: UniformPairs): void {
        for(const key in uniforms){
            shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        //NOTE: マテリアルに関係するもののみをUniform設定する
    }
}