import { Vector3 } from "../../../math/vector/Vector3";
import { Light } from "../../light/Light";
import { DirectionalLightParams, LightType } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class DirectionalLightNode extends LightNode {
    
    private lightDirection: Vector3;

    constructor(light: Light, lightDirection: Vector3 = new Vector3(-0.5, 0.5, 0.5)){
        super(light);
        this.lightDirection = lightDirection;
    }

    public setLightDirection(lightDirection: Vector3): void {
        this.lightDirection = lightDirection;
    }

    public getLightData(): DirectionalLightParams {
        return {
            direction: this.lightDirection,
            lightType: LightType.Directional,
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}