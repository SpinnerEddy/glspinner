import { ShaderAttribute } from "../../webgl/gl/attribute/ShaderAttribute";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { RendererContext } from "../renderer/RendererContext";
import { MaterialOperation } from "./MaterialOperation";

export abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;

    constructor(shaderProgram: ShaderProgram){
        this.shaderProgram = shaderProgram;
    }

    use(gl: WebGL2RenderingContext, context: RendererContext): void {
        if(context.isCurrentShaderProgramSame(this.shaderProgram)) {
            return;
        }

        this.shaderProgram.use(gl);
        context.setCurrentShaderProgram(this.shaderProgram);
    }

    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute {
        return this.shaderProgram.getAttribute(gl, name);
    }

    cleanup(): void {}
    
    abstract setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}