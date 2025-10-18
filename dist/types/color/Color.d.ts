import { Vector3 } from "../math/vector/Vector3";
import { Vector4 } from "../math/vector/Vector4";
import { Color255 } from "./Color255";
export declare class Color {
    private r;
    private g;
    private b;
    private a;
    constructor(r: number, g: number, b: number, a?: number);
    static empty(): Color;
    static isEmpty(color: Color): boolean;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    get toRGBArray(): Float32Array;
    get toRGBAArray(): Float32Array;
    getRgbToVector3(): Vector3;
    toVector4(): Vector4;
    translateTo255(): Color255;
}
