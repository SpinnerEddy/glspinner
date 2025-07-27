import { Vector3 } from "../../../math/vector/Vector3";
import { Light } from "../../light/Light";
import { DirectionalLightParams, LightType } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class DirectionalLightNode extends LightNode {
    
    constructor(light: Light){
        super(light);
    }

    public getLightData(): DirectionalLightParams {
        return {
            direction: new Vector3(-0.5, 0.5, 0.5),
            lightType: LightType.Directional,
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}