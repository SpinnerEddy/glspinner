import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMaterial } from "./BaseMaterial";

export class FragmentCanvasMaterial extends BaseMaterial {
    
    constructor(shaderProgram: ShaderProgram){
        super(shaderProgram);
        shaderProgram.getFragmentShader();
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void {
        const uniforms = context.getGlobalUniform();
        this.shaderProgram.setUniform(gl, "modelMatrix", uniforms["modelMatrix"]);

        // const fragmentUniforms = context.getFragmentCanvasUniform();
        // for(const key in fragmentUniforms){
        //     this.shaderProgram.setUniform(gl, key, fragmentUniforms[key]);
        // }
    }
}