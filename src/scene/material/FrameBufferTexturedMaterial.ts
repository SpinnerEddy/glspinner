import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { TextureSlot } from "../../webgl/gl/texture/TextureConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";

export class FrameBufferTexturedMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram){
        super(shaderProgram);
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void {
        const uniforms = context.getGlobalUniform();
        this.shaderProgram.setUniform(gl, "mvpMatrix", uniforms["mvpMatrix"]);
        this.shaderProgram.setUniform(gl, "tex", new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

}