import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MaterialOperation } from "./MaterialOperation";

export abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;

    constructor(shaderProgram: ShaderProgram){
        this.shaderProgram = shaderProgram;
    }

    use(): void {
        this.shaderProgram.use();
    }

    abstract setUniform(uniforms: UniformPairs): void;
}