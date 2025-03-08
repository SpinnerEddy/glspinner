import { MathUtility } from "../math/MathUtility";
import { Color } from "./Color";

export class Color255{
    private r: number;
    private g: number;
    private b: number;
    private a: number;

    constructor(r: number, g: number, b: number, a: number = 255)
    {
        this.r = MathUtility.clamp(r, 0, 255);
        this.g = MathUtility.clamp(g, 0, 255);
        this.b = MathUtility.clamp(b, 0, 255);
        this.a = MathUtility.clamp(a, 0, 255);
    }

    get red(): number
    {
        return this.r;
    }

    get green(): number
    {
        return this.g;
    }

    get blue(): number
    {
        return this.b;
    }

    get alpha(): number
    {
        return this.a;
    }

    public translateTo01(): Color
    {
        const r = Number.parseFloat((this.r / 255.0).toFixed(3));
        const g = Number.parseFloat((this.g / 255.0).toFixed(3));
        const b = Number.parseFloat((this.b / 255.0).toFixed(3));
        const a = Number.parseFloat((this.a / 255.0).toFixed(3));

        return new Color(r, g, b, a);
    }

    public translateToColorCode(): string
    {
        const toHex = (x: number) => x.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }
}