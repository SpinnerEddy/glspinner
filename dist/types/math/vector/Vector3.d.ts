import { Vector } from "./Vector";
export declare class Vector3 extends Vector<Vector3> {
    constructor(x: number, y: number, z: number);
    set x(x: number);
    set y(y: number);
    set z(z: number);
    get x(): number;
    get y(): number;
    get z(): number;
    create(x?: number, y?: number, z?: number): Vector3;
    min(other: Vector3, out?: Vector3): Vector3;
    max(other: Vector3, out?: Vector3): Vector3;
    add(other: Vector3, out?: Vector3): Vector3;
    sub(other: Vector3, out?: Vector3): Vector3;
    multiply(other: number, out?: Vector3): Vector3;
    div(other: number, out?: Vector3): Vector3;
    setLength(other: number, out?: Vector3): Vector3;
    limit(other: number, out?: Vector3): Vector3;
    normalize(out?: Vector3): Vector3;
    calcDistance(other: Vector3): number;
    calcAngle(other: Vector3): number;
    dot(other: Vector3): number;
    length(): number;
    lerp(other: Vector3, t: number, out?: Vector3): Vector3;
    clone(): Vector3;
    cross(other: Vector3, out?: Vector3): Vector3;
    heading3D(): [elevation: number, azimuth: number];
}
