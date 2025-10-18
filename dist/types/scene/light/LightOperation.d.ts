import { Color } from "../../color/Color";
export interface LightOperation {
    setColor(color: Color): void;
    setIntensity(intensity: number): void;
    getColor(): Color;
    getIntensity(): number;
}
