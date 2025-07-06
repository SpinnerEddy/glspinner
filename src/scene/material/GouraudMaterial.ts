import { Color } from "../../color/Color";
import { Vector3 } from "../../math/vector/Vector3";
import { Vector4 } from "../../math/vector/Vector4";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export class GouraudMaterial extends BaseMaterial {
    private lightDirection: Vector3;
    private eyeDirection: Vector3;
    private ambientColor: Color;

    constructor(shaderProgram: ShaderProgram, lightDirection: Vector3, eyeDirection: Vector3, ambientColor: Color){
        super(shaderProgram);
        this.lightDirection = lightDirection;
        this.eyeDirection = eyeDirection;
        this.ambientColor = ambientColor;
    }

    setLightDirection(lightDirection: Vector3): void {
        this.lightDirection = lightDirection;
    }

    setEyeDirection(eyeDirection: Vector3): void {
        this.eyeDirection = eyeDirection;
    }

    setAmbientColor(ambientColor: Color): void {
        this.ambientColor = ambientColor;
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }

        this.shaderProgram.setUniform(gl, "lightDirection", new ShaderUniformValue(this.lightDirection));
        this.shaderProgram.setUniform(gl, "eyeDirection", new ShaderUniformValue(this.eyeDirection));
        this.shaderProgram.setUniform(gl, "ambientColor", new ShaderUniformValue(this.ambientColor.toVector4()));
    }
}