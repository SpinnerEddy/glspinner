import { SceneNode } from "./node/SceneNode";

export class SceneGraphUtility{
    public static replaceNode(root: SceneNode, target: SceneNode, newNode: SceneNode, isTakeOver: boolean = false): void {
        const index = root.getChildren().indexOf(target);
        if(index === -1) return;

        if(isTakeOver){
            for(const child of target.getChildren()){
                newNode.addChild(child);
            }
        }

        root.removeChild(target);
        root.addChild(newNode);
    }

    public static addChild(target: SceneNode, newNode: SceneNode): void {
        target.addChild(newNode);
    }

    public static findNodeById(root: SceneNode, id: string): SceneNode | undefined {
        if(root.getId() === id) return root;
        for(const child of root.getChildren()){
            const foundNode = this.findNodeById(child, id);
            if(foundNode !== undefined) return foundNode;
        }
        return undefined;
    }

    public static traverse(root: SceneNode, callback: (node: SceneNode) => void): void {
        callback(root);
        for(const child of root.getChildren()){
            this.traverse(child, callback);
        }
    }
}