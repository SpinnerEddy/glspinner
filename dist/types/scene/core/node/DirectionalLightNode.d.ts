import { Vector3 } from "../../../math/vector/Vector3";
import { Light } from "../../light/Light";
import { DirectionalLightParams } from "../../light/LightConstants";
import { LightNode } from "./LightNode";
export declare class DirectionalLightNode extends LightNode {
    private lightDirection;
    constructor(light: Light, lightDirection?: Vector3);
    setLightDirection(lightDirection: Vector3): void;
    getLightData(): DirectionalLightParams;
}
