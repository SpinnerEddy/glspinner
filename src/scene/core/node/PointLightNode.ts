import { Light } from "../../light/Light";
import { LightType, PointLightParams } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class PointLightNode extends LightNode {
    
    constructor(light: Light){
        super(light);
    }

    public getLightData(): PointLightParams {
        return {
            position: this.transform.getWorldPosition(),
            lightType: LightType.Point,
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}