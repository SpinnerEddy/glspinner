import { Color } from "../../color/Color";
import { Vector3 } from "../../math/vector/Vector3";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class GouraudMaterial extends BaseMaterial {
    private lightDirection;
    private eyeDirection;
    private ambientColor;
    constructor(shaderProgram: ShaderProgram, lightDirection: Vector3, eyeDirection: Vector3, ambientColor: Color);
    setLightDirection(lightDirection: Vector3): void;
    setEyeDirection(eyeDirection: Vector3): void;
    setAmbientColor(ambientColor: Color): void;
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}
