import { Color } from "./Color";
import { Color255 } from "./Color255";
export declare class ColorUtility {
    static hexToColor255(colorCode: string): Color255;
    static hexToColor01(colorCode: string): Color;
    static hsvToRgb(hue: number, saturation: number, value: number, alpha: number): Color;
}
