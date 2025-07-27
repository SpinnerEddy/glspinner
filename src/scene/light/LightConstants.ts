import { Color } from "../../color/Color";
import { Vector3 } from "../../math/vector/Vector3";

export const LightType = {
    Directional: 1,
    Point: 2
} as const;

export type BaseLightParams = {
    lightType: number;
    color: Color;
    intensity: number;
}

export type DirectionalLightParams = BaseLightParams & {
    direction: Vector3;
}

export type PointLightParams = BaseLightParams & {
    position: Vector3;
}

export type LightParams = DirectionalLightParams | PointLightParams;