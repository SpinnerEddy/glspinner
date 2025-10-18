import { RendererContext } from "../../renderer/RendererContext";
import { Transform } from "../../transform/Transform";
export declare abstract class SceneNode {
    protected id: string;
    protected parent: SceneNode | undefined;
    protected children: SceneNode[];
    protected transform: Transform;
    constructor(id?: string);
    addChild(child: SceneNode): void;
    removeChild(child: SceneNode): void;
    getChildren(): SceneNode[];
    getId(): string;
    getTransform(): Transform;
    private setParent;
    abstract update(): void;
    abstract draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
