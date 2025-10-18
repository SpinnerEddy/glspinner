import { ShaderAttribute } from "../../webgl/gl/attribute/ShaderAttribute";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { RendererContext } from "../renderer/RendererContext";
import { MaterialOperation } from "./MaterialOperation";
export declare abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;
    constructor(shaderProgram: ShaderProgram);
    use(gl: WebGL2RenderingContext, context: RendererContext): void;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    cleanup(): void;
    abstract setUniform(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
}
