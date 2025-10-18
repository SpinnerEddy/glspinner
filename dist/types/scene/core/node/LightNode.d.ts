import { Light } from "../../light/Light";
import { LightParams } from "../../light/LightConstants";
import { RendererContext } from "../../renderer/RendererContext";
import { SceneNode } from "./SceneNode";
export declare abstract class LightNode extends SceneNode {
    protected light: Light;
    constructor(light: Light);
    abstract getLightData(): LightParams;
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
