import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "./BaseMaterial";
export declare class BlurMaterial extends BaseMaterial {
    private isVertical;
    private blurCoefficients;
    constructor(shaderProgram: ShaderProgram, isVertical: boolean, blueRange?: number);
    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}
