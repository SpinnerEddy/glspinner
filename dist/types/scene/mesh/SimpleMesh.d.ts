import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
import { BaseMesh } from "./BaseMesh";
export declare class SimpleMesh extends BaseMesh {
    constructor(geometry: BaseGeometry, material: BaseMaterial);
    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void;
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
