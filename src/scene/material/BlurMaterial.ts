import { MathUtility } from "../../math/MathUtility";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { TextureSlot } from "../../webgl/gl/texture/TextureConstants";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { BaseMaterial } from "./BaseMaterial";

export type BlurDirection = {
    Vertical: true,
    Horizontal: false
};

export class BlurMaterial extends BaseMaterial {

    private blurDirection: BlurDirection;
    private blurCoefficients: Float32Array;
    
    constructor(shaderProgram: ShaderProgram, blurDirection: BlurDirection, blueRange: number = 10.0) {
        super(shaderProgram);
        this.blurDirection = blurDirection;
        this.blurCoefficients = MathUtility.calculateGaussianCoefficients(blueRange, 32);
    }

    setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "isVertial", new ShaderUniformValue(this.blurDirection.Vertical ? 1 : 0, 'int'));
        this.shaderProgram.setUniform(gl, "gCoefficients", new ShaderUniformValue(this.blurCoefficients));
        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }
}