import { Rectangle } from "../../webgl/gl/geometry/Rectangle";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class FullScreenQuadMesh extends BaseMesh{

    constructor(geometry: Rectangle, material: BaseMaterial){
        super(geometry, material);
    }

    updateMaterialParams(): void {
        
    }

    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.material.setUniform(gl, uniforms);
    }

    draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}