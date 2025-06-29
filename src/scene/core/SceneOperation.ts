import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MeshOperation } from "../mesh/MeshOperation";

export interface SceneOperation{
    start(): void;
    stop(): void;
    reset(): void;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
}
export abstract class BaseMesh implements MeshOperation {
    protected geometry: BaseGeometry;
    protected shaderProgram: ShaderProgram;

    constructor(geometry: BaseGeometry, shaderProgram: ShaderProgram) {
        this.geometry = geometry;
        this.shaderProgram = shaderProgram;
    }

    getShaderProgram(): ShaderProgram {
        throw new Error("Method not implemented.");
    }

    useShaderProgram(gl: WebGL2RenderingContext): void {
        throw new Error("Method not implemented.");
    }

    abstract updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}
