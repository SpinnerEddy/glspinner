import { Light } from "../../light/Light";
import { AmbientLightParams, LightType } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class AmbientLightNode extends LightNode {

    constructor(light: Light) {
        super(light);
    }

    getLightData(): AmbientLightParams {
        return {
            lightType: LightType.Ambient,
            color: this.light.getColor(),
            intensity: this.light.getIntensity(),
        };
    }
}
