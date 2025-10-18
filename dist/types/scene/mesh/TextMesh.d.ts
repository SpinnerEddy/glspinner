import { TextQuad } from "../../webgl/gl/geometry/TextQuad";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { BaseMesh } from "./BaseMesh";
export declare class TextMesh extends BaseMesh {
    constructor(geometry: TextQuad, material: BaseMaterial);
    get resolution(): [number, number];
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}
