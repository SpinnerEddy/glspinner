import { Vector } from "./Vector";
export declare class Vector4 extends Vector<Vector4> {
    constructor(x: number, y: number, z: number, w: number);
    set x(x: number);
    set y(y: number);
    set z(z: number);
    set w(w: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    create(x?: number, y?: number, z?: number, w?: number): Vector4;
    min(other: Vector4, out?: Vector4): Vector4;
    max(other: Vector4, out?: Vector4): Vector4;
    add(other: Vector4, out?: Vector4): Vector4;
    sub(other: Vector4, out?: Vector4): Vector4;
    multiply(other: number, out?: Vector4): Vector4;
    div(other: number, out?: Vector4): Vector4;
    setLength(other: number, out?: Vector4): Vector4;
    limit(other: number, out?: Vector4): Vector4;
    normalize(out?: Vector4): Vector4;
    calcDistance(other: Vector4): number;
    calcAngle(other: Vector4): number;
    dot(other: Vector4): number;
    length(): number;
    lerp(other: Vector4, t: number, out?: Vector4): Vector4;
    clone(): Vector4;
}
