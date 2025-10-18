import { BaseMesh } from "../../mesh/BaseMesh";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";
export declare class MeshNode extends SceneNode {
    private mesh;
    constructor(mesh: BaseMesh, id?: string);
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    private updateUniforms;
    private updateMaterialParams;
}
