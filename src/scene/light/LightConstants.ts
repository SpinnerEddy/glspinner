import { Color } from '../../color/Color';
import { Vector3 } from '../../math/vector/Vector3';

export const LightType = {
    Directional: 1,
    Point: 2,
    Ambient: 3,
} as const;

export const MAX_DIRECTIONAL_LIGHTS = 8;
export const MAX_POINT_LIGHTS = 8;

type LightCommonParams = {
    color: Color;
    intensity: number;
};

export type DirectionalLightParams = LightCommonParams & {
    lightType: typeof LightType.Directional;
    direction: Vector3;
};

export type PointLightParams = LightCommonParams & {
    lightType: typeof LightType.Point;
    position: Vector3;
};

export type AmbientLightParams = LightCommonParams & {
    lightType: typeof LightType.Ambient;
};

export type LightParams = DirectionalLightParams | PointLightParams | AmbientLightParams;
