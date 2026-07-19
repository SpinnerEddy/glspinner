import { Rectangle } from "../../webgl/gl/geometry/Rectangle";
import { MaterialOperation } from "../material/MaterialOperation";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class FullScreenQuadMesh extends BaseMesh {
    constructor(geometry: Rectangle, material: MaterialOperation);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
