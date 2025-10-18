import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
import { MeshOperation } from "./MeshOperation";
export declare abstract class BaseMesh implements MeshOperation {
    protected geometry: BaseGeometry;
    protected material: BaseMaterial;
    constructor(geometry: BaseGeometry, material: BaseMaterial);
    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void;
    updateMaterialParams(_gl: WebGL2RenderingContext, _transform: Transform, _context: RendererContext): void;
    abstract updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}
