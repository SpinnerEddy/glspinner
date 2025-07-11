import { ColorUtility } from "../../color/ColorUtility";
import { LightGuiController } from "../../tools/gui/LightGuiController";
import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { GouraudMaterial } from "../material/GouraudMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";

export class SimpleMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        super(geometry, material);
    }

    updateMaterialParams(): void {
        const gouraud = this.material as GouraudMaterial;
        gouraud.setLightDirection(LightGuiController.lightOptions.lightDirection);
        gouraud.setEyeDirection(LightGuiController.lightOptions.eyeDirection);
        gouraud.setAmbientColor(ColorUtility.hexToColor01(LightGuiController.lightOptions.ambientColor));
    }
    
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void {
        this.material.setUniform(gl, uniforms);
    }

    draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.use(gl);
        this.geometry.bind();
        gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
        this.geometry.unbind();
    }
}