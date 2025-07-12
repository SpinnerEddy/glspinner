import { ShaderAttribute } from "../../webgl/gl/attribute/ShaderAttribute";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { MaterialOperation } from "./MaterialOperation";

export abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;

    constructor(shaderProgram: ShaderProgram){
        this.shaderProgram = shaderProgram;
    }

    use(gl: WebGL2RenderingContext): void {
        this.shaderProgram.use(gl);
    }

    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute {
        return this.shaderProgram.getAttribute(gl, name);
    }
    
    abstract setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}