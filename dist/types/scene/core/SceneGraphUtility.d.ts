import { SceneNode } from "./node/SceneNode";
export declare class SceneGraphUtility {
    static replaceNode(root: SceneNode, target: SceneNode, newNode: SceneNode, isTakeOver?: boolean): void;
    static addChild(target: SceneNode, newNode: SceneNode): void;
    static findNodeById(root: SceneNode, id: string): SceneNode | undefined;
    static traverse(root: SceneNode, callback: (node: SceneNode) => void): void;
}
