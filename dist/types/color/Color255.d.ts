import { Color } from "./Color";
export declare class Color255 {
    private r;
    private g;
    private b;
    private a;
    constructor(r: number, g: number, b: number, a?: number);
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    translateTo01(): Color;
    translateToColorCode(): string;
}
