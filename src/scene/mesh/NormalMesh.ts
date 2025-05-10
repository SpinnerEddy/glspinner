import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMesh } from "./BaseMesh";

export class NormalMesh extends BaseMesh{

    update(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.material.setUniform(gl, uniforms);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.material.use(gl);
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}