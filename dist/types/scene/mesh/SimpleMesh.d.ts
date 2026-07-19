import { GeometryOperation } from "../../webgl/gl/geometry/GeometryOperation";
import { MaterialOperation } from "../material/MaterialOperation";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
import { BaseMesh } from "./BaseMesh";
export declare class SimpleMesh extends BaseMesh {
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void;
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
