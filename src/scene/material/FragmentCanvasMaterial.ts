import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class FragmentCanvasMaterial extends BaseMaterial {

    private resolution: [number, number];

    constructor(shaderProgram: ShaderProgram, resolution: [number, number]){
        super(shaderProgram);
        this.resolution = resolution;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        this.shaderProgram.setUniform(gl, "resolution", new ShaderUniformValue(this.resolution));
    }
}