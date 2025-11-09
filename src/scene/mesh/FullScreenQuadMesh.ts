import { Rectangle } from "../../webgl/gl/geometry/Rectangle";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class FullScreenQuadMesh extends BaseMesh {

    constructor(geometry: Rectangle, material: BaseMaterial){
        super(geometry, material);
    }

    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.setUniform(gl, context);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}