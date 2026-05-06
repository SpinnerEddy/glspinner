import { RenderTag, RenderTagConstants } from "../../renderer/definition/RenderTag";
import { RendererContext } from "../../renderer/RendererContext";
import { Transform } from "../../transform/Transform";
import { SceneGraphNodeIdGenerator } from "../SceneGraphNodeIdGenerator";

export abstract class SceneNode {
    protected id: string;
    protected parent: SceneNode | undefined = undefined;
    protected children: SceneNode[];
    protected transform: Transform;
    protected renderTag: RenderTag;

    constructor(id: string = ""){
        this.transform = new Transform();
        this.children = [];
        this.renderTag = RenderTagConstants.ALL;

        const className = this.constructor as Function;
        this.id = id !== "" ? id : SceneGraphNodeIdGenerator.generateId(className.name);
    }

    public addChild(child: SceneNode): void {
        if (child === this) return;

        child.setParent(this);
    }

    public removeChild(child: SceneNode): void {
        if (child.parent !== this) return;

        child.setParent(undefined);
    }

    public getChildren(): SceneNode[] {
        return this.children;
    }

    public getId(): string {
        return this.id;
    }

    public getTransform(): Transform {
        return this.transform;
    }

    public shouldDraw(rendererContext: RendererContext): boolean {
        const renderTag = rendererContext.getActivateRenderTag();

        if (renderTag == RenderTagConstants.ALL) return true;

        return this.renderTag == renderTag;
    }

    private setParent(parent: SceneNode | undefined): void {
        if (this.parent == parent) return;

        if (this.parent !== undefined){
            const index = this.parent.children.indexOf(this);
            if (index !== -1){
                this.parent.children.splice(index, 1);
            }
        }

        this.parent = parent;

        if (parent !== undefined && !parent.children.includes(this)){
            parent.children.push(this);
        }
    }

    public abstract update(): void;
    public abstract draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}