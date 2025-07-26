import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { BaseMaterial } from "../material/BaseMaterial";
import { RendererContext } from "../renderer/RendererContext";
import { MeshOperation } from "./MeshOperation";

export abstract class BaseMesh implements MeshOperation {
    protected geometry: BaseGeometry;
    protected material: BaseMaterial;
    
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        this.geometry = geometry;
        this.material = material;
    }

    abstract updateMaterialParams(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract updateUniforms(gl: WebGL2RenderingContext, uniforms: UniformPairs): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}