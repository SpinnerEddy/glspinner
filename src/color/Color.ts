import { MathUtility } from "../math/MathUtility";
import { Vector3 } from "../math/vector/Vector3";
import { Vector4 } from "../math/vector/Vector4";
import { Color255 } from "./Color255";

export class Color{
    private r: number;
    private g: number;
    private b: number;
    private a: number;

    constructor(r: number, g: number, b: number, a: number = 1.0)
    {
        this.r = MathUtility.clamp(r, 0.0, 1.0);
        this.g = MathUtility.clamp(g, 0.0, 1.0);
        this.b = MathUtility.clamp(b, 0.0, 1.0);
        this.a = MathUtility.clamp(a, 0.0, 1.0);
    }

    static empty(): Color {
        return new Color(0, 0, 0, 0);
    }

    static isEmpty(color: Color): boolean {
        return color.red == 0 && color.green == 0 && color.blue == 0 && color.alpha == 0;
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

    get toRGBArray(): Float32Array
    {
        return new Float32Array([this.r, this.g, this.b]);
    }

    public getRgbToVector3(): Vector3
    {
        return new Vector3(this.r, this.g, this.b);
    }

    public toVector4(): Vector4
    {
        return new Vector4(this.r, this.g, this.b, this.a);
    }

    public translateTo255(): Color255
    {
        const r = Math.round(this.r * 255.0);
        const g = Math.round(this.g * 255.0);
        const b = Math.round(this.b * 255.0);
        const a = Math.round(this.a * 255.0);
        
        return new Color255(r, g, b, a);
    }
}