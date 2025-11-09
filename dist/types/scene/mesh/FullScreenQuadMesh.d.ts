import { Rectangle } from "../../webgl/gl/geometry/Rectangle";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class FullScreenQuadMesh extends BaseMesh {
    constructor(geometry: Rectangle, material: BaseMaterial);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
