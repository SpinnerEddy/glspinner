import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
import { BaseMesh } from "./BaseMesh";

export class UnlitMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        super(geometry, material);
    }

    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void {
        
    }
    
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.material.setUniform(gl, uniforms);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.material.use(gl);
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
        this.material.cleanup(gl);
    }
}