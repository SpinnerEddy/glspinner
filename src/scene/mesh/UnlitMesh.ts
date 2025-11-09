import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class UnlitMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        super(geometry, material);
    }
    
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.setUniform(gl, context);
    }

    draw(gl: WebGL2RenderingContext): void {

        gl.enable(gl.DEPTH_TEST);
    	gl.depthFunc(gl.LEQUAL);
        gl.disable(gl.CULL_FACE);

        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup();
    }
}