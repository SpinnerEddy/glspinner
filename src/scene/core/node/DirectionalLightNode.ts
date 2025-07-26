import { Vector3 } from "../../../math/vector/Vector3";
import { Light } from "../../light/Light";
import { LightParams } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class DirectionalLightNode extends LightNode {
    constructor(light: Light){
        super(light);
    }

    public getLightData(): LightParams {
        return {
            direction: new Vector3(-0.5, 0.5, 0.5),
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }


}