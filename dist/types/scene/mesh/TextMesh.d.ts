import { TextQuad } from "../../webgl/gl/geometry/TextQuad";
import { MaterialOperation } from "../material/MaterialOperation";
import { RendererContext } from "../renderer/RendererContext";
import { BaseMesh } from "./BaseMesh";
export declare class TextMesh extends BaseMesh {
    constructor(geometry: TextQuad, material: MaterialOperation);
    get resolution(): [number, number];
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}
