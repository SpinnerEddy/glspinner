import { Light } from "../../light/Light";
import { LightParams } from "../../light/LightConstants";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";

export abstract class LightNode extends SceneNode{
    protected light: Light;

    constructor(light: Light){
        super();
        this.light = light;
    }

    public abstract getLightData(): LightParams;
    public abstract getLightType(): number;

    public update(): void {
        this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix());

        for (const child of this.children) {
            child.update();
        }
    }

    public draw(gl: WebGL2RenderingContext, context: RendererContext): void {
        for (const child of this.children) {
            child.draw(gl, context);
        }
    }

}