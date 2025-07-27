import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { DirectionalLightParams, LightParams, LightType, PointLightParams } from "../light/LightConstants";
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
        if(light.lightType == LightType.Directional){
            const directional = light as DirectionalLightParams;
            this.shaderProgram.setUniform(gl, "lightDirection", new ShaderUniformValue(directional.direction));
            this.shaderProgram.setUniform(gl, "ambientColor", new ShaderUniformValue(directional.color.toVector4()));
            this.shaderProgram.setUniform(gl, "lightType", new ShaderUniformValue(directional.lightType));
        }else if(light.lightType == LightType.Point){
            const point = light as PointLightParams;
            this.shaderProgram.setUniform(gl, "lightPosition", new ShaderUniformValue(point.position));
            this.shaderProgram.setUniform(gl, "ambientColor", new ShaderUniformValue(point.color.toVector4()));
            this.shaderProgram.setUniform(gl, "lightType", new ShaderUniformValue(point.lightType, 'int'));
        }
    }
}