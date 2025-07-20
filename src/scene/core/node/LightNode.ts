import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";

export abstract class LightNode extends SceneNode{

    constructor(){
        super();
    }

    public update(): void {
        
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        
    }

}