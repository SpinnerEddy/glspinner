import { Color } from "../../color/Color";
import { LightOperation } from "./LightOperation";
export declare class Light implements LightOperation {
    private color;
    private intensity;
    constructor(color: Color, intensity: number);
    setColor(color: Color): void;
    setIntensity(intensity: number): void;
    getColor(): Color;
    getIntensity(): number;
}
