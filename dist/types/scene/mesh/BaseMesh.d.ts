import { GeometryOperation } from "../../webgl/gl/geometry/GeometryOperation";
import { MaterialOperation } from "../material/MaterialOperation";
import { RendererContext } from "../renderer/RendererContext";
import { Transform } from "../transform/Transform";
import { MeshOperation } from "./MeshOperation";
export declare abstract class BaseMesh implements MeshOperation {
    protected geometry: GeometryOperation;
    protected material: MaterialOperation;
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void;
    updateMaterialParams(_gl: WebGL2RenderingContext, _transform: Transform, _context: RendererContext): void;
    abstract updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}
