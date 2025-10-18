import { Vector } from "./Vector";
export declare class Vector2 extends Vector<Vector2> {
    constructor(x: number, y: number);
    set x(x: number);
    set y(y: number);
    get x(): number;
    get y(): number;
    create(x?: number, y?: number): Vector2;
    min(other: Vector2, out?: Vector2): Vector2;
    max(other: Vector2, out?: Vector2): Vector2;
    add(other: Vector2, out?: Vector2): Vector2;
    sub(other: Vector2, out?: Vector2): Vector2;
    multiply(other: number, out?: Vector2): Vector2;
    div(other: number, out?: Vector2): Vector2;
    setLength(other: number, out?: Vector2): Vector2;
    limit(other: number, out?: Vector2): Vector2;
    normalize(out?: Vector2): Vector2;
    calcDistance(other: Vector2): number;
    calcAngle(other: Vector2): number;
    dot(other: Vector2): number;
    length(): number;
    lerp(other: Vector2, t: number, out?: Vector2): Vector2;
    clone(): Vector2;
    heading2D(): number;
}
