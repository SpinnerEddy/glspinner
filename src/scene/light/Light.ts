import { Color } from "../../color/Color";
import { LightOperation } from "./LightOperation";

export class Light implements LightOperation { 
    private color: Color;
    private intensity: number;

    constructor(color: Color, intensity: number){
        this.color = color;
        this.intensity = intensity;
    }

    getColor(): Color {
        return this.color;
    }

    getIntensity(): number {
        return this.intensity;
    }
}