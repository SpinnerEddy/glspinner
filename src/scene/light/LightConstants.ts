import { Color } from "../../color/Color";
import { Vector3 } from "../../math/vector/Vector3";

export type LightParams = {
    position?: Vector3;
    direction?: Vector3;
    color: Color;
    intensity: number;
}
