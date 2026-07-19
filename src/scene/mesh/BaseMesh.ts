import { GeometryOperation } from '../../webgl/gl/geometry/GeometryOperation';
import { MaterialOperation } from '../material/MaterialOperation';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { MeshOperation } from './MeshOperation';

export abstract class BaseMesh implements MeshOperation {
    protected geometry: GeometryOperation;
    protected material: MaterialOperation;

    constructor(geometry: GeometryOperation, material: MaterialOperation) {
        this.geometry = geometry;
        this.material = material;
    }

    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void {
        this.material.use(gl, context);
    }

    updateMaterialParams(_gl: WebGL2RenderingContext, _transform: Transform, _context: RendererContext): void {}

    abstract updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}
