import { GeometryOperation } from "../../webgl/gl/geometry/GeometryOperation";
import { MaterialOperation } from "../material/MaterialOperation";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class UnlitMesh extends BaseMesh {
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
