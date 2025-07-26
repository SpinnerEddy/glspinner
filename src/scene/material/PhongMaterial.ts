import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { LightParams } from "../light/LightConstants";
import { BaseMaterial } from "./BaseMaterial";

export class PhongMaterial extends BaseMaterial {
    
    constructor(shaderProgram: ShaderProgram){
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }
    }

    setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void {
        this.shaderProgram.setUniform(gl, "lightDirection", new ShaderUniformValue(light.direction!));
        this.shaderProgram.setUniform(gl, "ambientColor", new ShaderUniformValue(light.color.toVector4()));
    }
}