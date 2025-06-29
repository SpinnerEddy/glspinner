import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMesh } from "./BaseMesh";

export class SimpleMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, shaderProgram: ShaderProgram){
        super(geometry, shaderProgram);
    }

    getShaderProgram(): ShaderProgram {
        return this.shaderProgram;
    }

    useShaderProgram(gl: WebGL2RenderingContext): void {
        this.shaderProgram.use(gl);
    }
    
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        for(const key in uniforms){
            this.shaderProgram.setUniform(gl, key, uniforms[key]);
        }
    }

    draw(gl: WebGL2RenderingContext): void {
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}