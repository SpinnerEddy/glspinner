import { TextQuad } from "../../webgl/gl/geometry/TextQuad";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class TextMesh extends BaseMesh {
    constructor(geometry: TextQuad, material: BaseMaterial){
        super(geometry, material);
    }

    get resolution(): [number, number] {
        return (this.geometry as TextQuad).resolution;
    }
    
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.setUniform(gl, context);
    }

    draw(gl: WebGL2RenderingContext): void {
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);

        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup();
    }
}