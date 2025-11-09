import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { Texture2D } from "../../webgl/gl/texture/Texture2D";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";
export declare class TexturedMaterial extends BaseMaterial {
    private texture;
    private texIndex;
    constructor(shaderProgram: ShaderProgram, texture: Texture2D, index: number);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    cleanup(): void;
}
