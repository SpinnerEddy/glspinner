import { Vector } from "./vector/Vector";
import { Vector2 } from "./vector/Vector2";
import { Vector3 } from "./vector/Vector3";
export declare class VectorCalculator {
    static min<T extends Vector<T>>(a: T, b: T): T;
    static max<T extends Vector<T>>(a: T, b: T): T;
    static add<T extends Vector<T>>(a: T, b: T): T;
    static sub<T extends Vector<T>>(a: T, b: T): T;
    static calcDistance<T extends Vector<T>>(a: T, b: T): number;
    static calcAngle<T extends Vector<T>>(a: T, b: T): number;
    static dot<T extends Vector<T>>(a: T, b: T): number;
    static multiply<T extends Vector<T>>(a: T, b: number): T;
    static divide<T extends Vector<T>>(a: T, b: number): T;
    static limit<T extends Vector<T>>(a: T, b: number): T;
    static setLength<T extends Vector<T>>(a: T, b: number): T;
    static normalize<T extends Vector<T>>(vector: T): T;
    static length<T extends Vector<T>>(vector: T): number;
    static lerp<T extends Vector<T>>(min: T, max: T, t: number): T;
    static cross(a: Vector3, b: Vector3): Vector3;
    static heading2D(vector: Vector2): number;
    static heading3D(vector: Vector3): [elevation: number, azimuth: number];
    private static convertVector;
}
