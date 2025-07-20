import { Light } from "../../light/Light";
import { LightOptions } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class PointLightNode extends LightNode {
    
    constructor(light: Light){
        super(light);
    }

    public getLightData(): LightOptions {
        return {
            position: this.transform.getWorldPosition(),
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}