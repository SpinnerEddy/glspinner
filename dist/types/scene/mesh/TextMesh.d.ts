import { TextQuad } from "../../webgl/gl/geometry/TextQuad";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class TextMesh extends BaseMesh {
    constructor(geometry: TextQuad, material: BaseMaterial);
    get resolution(): [number, number];
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
