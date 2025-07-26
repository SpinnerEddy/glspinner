import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { PhongMaterial } from "../material/PhongMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class SimpleMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        super(geometry, material);
    }

    updateMaterialParams(gl: WebGL2RenderingContext, context: RendererContext): void {
        const phong = this.material as PhongMaterial;
        if(phong == null) return;
        if(context.getLights().length == 0) return;

        let light = context.getLights().at(0)!;
        phong.setLightUniform(gl, light);
    }
    
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.material.setUniform(gl, uniforms);
    }

    draw(gl: WebGL2RenderingContext): void {
        this.material.use(gl);
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}