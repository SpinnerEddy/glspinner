import { EmptyNode } from "./node/EmptyNode";

export class SceneGraph{
    private root: EmptyNode;

    constructor(){
        this.root = new EmptyNode();
    }
}