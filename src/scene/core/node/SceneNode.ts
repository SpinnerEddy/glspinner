import { Transform } from "../../transform/Transform";

export abstract class SceneNode{
    protected id: string;
    protected parent: SceneNode | undefined = undefined;
    protected children: SceneNode[];
    protected transform: Transform;

    constructor(id: string = ""){
        this.id = id;
        this.transform = new Transform();
        this.children = [];
    }

    public addChild(child: SceneNode){
        const index = this.children.indexOf(child);
        if(index === -1) return;

        this.children.push(child);
        child.parent = this;
    }

    public removeChild(child: SceneNode){
        const index = this.children.indexOf(child);
        if(index === -1) return;

        this.children.splice(index, 1);
        child.parent = undefined;
    }

    public abstract update(): void;
    public abstract draw(): void;
}