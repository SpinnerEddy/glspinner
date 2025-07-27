import { Light } from "../../light/Light";
import { LightParams, LightType } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class PointLightNode extends LightNode {
    
    constructor(light: Light){
        super(light);
    }

    public getLightType(): number {
        return LightType.Point;
    }

    public getLightData(): LightParams {
        return {
            position: this.transform.getWorldPosition(),
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}