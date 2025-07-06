import { Color } from "../../color/Color";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class UnlitMaterial extends BaseMaterial{

    private emissiveColor: Color;

    constructor(shaderProgram: ShaderProgram, emissiveColor: Color){
        super(shaderProgram);
        this.emissiveColor = emissiveColor;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        // this.shaderProgram.setUniform(gl, "emissiveColor", new ShaderUniformValue(this.emissiveColor.toVector4()));
    }
}