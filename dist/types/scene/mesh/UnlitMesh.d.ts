import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class UnlitMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
