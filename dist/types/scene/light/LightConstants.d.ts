import { Color } from "../../color/Color";
import { Vector3 } from "../../math/vector/Vector3";
export declare const LightType: {
    readonly Directional: 1;
    readonly Point: 2;
};
export type BaseLightParams = {
    lightType: number;
    color: Color;
    intensity: number;
};
export type DirectionalLightParams = BaseLightParams & {
    direction: Vector3;
};
export type PointLightParams = BaseLightParams & {
    position: Vector3;
};
export type LightParams = DirectionalLightParams | PointLightParams;
