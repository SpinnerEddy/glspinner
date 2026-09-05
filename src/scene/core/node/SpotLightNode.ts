import { TrigonometricConstants } from "../../../math/ValueConstants";
import { Light } from "../../light/Light";
import { LightType, SpotLightParams } from "../../light/LightConstants";
import { LightNode } from "./LightNode";

export class SpotLightNode extends LightNode {
    private innerConeAngle: number;
    private outerConeAngle: number;

    constructor(light: Light, innerConeAngle: number = TrigonometricConstants.PI / 8, outerConeAngle: number = TrigonometricConstants.PI / 6) {
        super(light);
        this.innerConeAngle = innerConeAngle;
        this.outerConeAngle = outerConeAngle;
    }

    setInnerConeAngle(angle: number): void { this.innerConeAngle = angle; }
    setOuterConeAngle(angle: number): void { this.outerConeAngle = angle; }

    getLightData(): SpotLightParams {
        return {
            position: this.transform.getWorldPosition(),
            direction: this.transform.getForwardVector(),
            innerConeAngle: this.innerConeAngle,
            outerConeAngle: this.outerConeAngle,
            lightType: LightType.Spot,
            color: this.light.getColor(),
            intensity: this.light.getIntensity()
        }
    }
}