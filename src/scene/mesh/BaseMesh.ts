import { BaseGeometry } from "../../webgl/gl/geometry/BaseGeometry";
import { BaseMaterial } from "../material/BaseMaterial";
import { MeshOperation } from "./MeshOperation";

export abstract class BaseMesh implements MeshOperation{
    private geometry: BaseGeometry;
    private material: BaseMaterial;
    
    constructor(geometry: BaseGeometry, material: BaseMaterial){
        this.geometry = geometry;
        this.material = material;
    }

    abstract draw(gl: WebGL2RenderingContext): void;
}