import { Rectangle } from "../../webgl/gl/geometry/Rectangle";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { BaseMesh } from "./BaseMesh";
export declare class FullScreenQuadMesh extends BaseMesh {
    constructor(geometry: Rectangle, material: BaseMaterial);
    updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    draw(gl: WebGL2RenderingContext): void;
}
