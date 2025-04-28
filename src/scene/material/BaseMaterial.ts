import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MaterialOperation } from "./MaterialOperation";

export abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;

    constructor(shaderProgram: ShaderProgram){
        this.shaderProgram = shaderProgram;
    }
    
    use(): void {
        throw new Error("Method not implemented.");
    }

    setUniform(uniforms: UniformPairs): void {
        throw new Error("Method not implemented.");
    }

}