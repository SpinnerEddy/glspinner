import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MeshOperation } from "./MeshOperation";

export abstract class BaseMesh implements MeshOperation {
    protected geometry: BaseGeometry;
    protected shaderProgram: ShaderProgram;
    
    constructor(geometry: BaseGeometry, shaderProgram: ShaderProgram){
        this.geometry = geometry;
        this.shaderProgram = shaderProgram;
    }

    abstract getShaderProgram(): ShaderProgram;
    abstract useShaderProgram(gl: WebGL2RenderingContext): void;
    abstract updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}