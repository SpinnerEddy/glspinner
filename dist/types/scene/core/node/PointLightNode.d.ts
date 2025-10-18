import { Light } from "../../light/Light";
import { PointLightParams } from "../../light/LightConstants";
import { LightNode } from "./LightNode";
export declare class PointLightNode extends LightNode {
    constructor(light: Light);
    getLightData(): PointLightParams;
}
