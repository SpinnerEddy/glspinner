import { TextMesh } from "../../mesh/TextMesh";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";
export declare class TextMeshNode extends SceneNode {
    private mesh;
    constructor(mesh: TextMesh, id?: string);
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    private updateUniforms;
    private updateMaterialParams;
}
