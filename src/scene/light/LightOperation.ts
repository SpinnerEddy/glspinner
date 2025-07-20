import { Color } from "../../color/Color";

export interface LightOperation{
    getColor(): Color;
    getIntensity(): number;
}