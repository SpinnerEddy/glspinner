import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { BaseMesh } from "./BaseMesh";
export declare class UnlitMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial);
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}
