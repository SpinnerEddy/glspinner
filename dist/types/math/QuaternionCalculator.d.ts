import { Quaternion } from "./quaternion/Quaternion";
import { Vector3 } from "./vector/Vector3";
import { Vector4 } from "./vector/Vector4";
export declare class QuaternionCalculator {
    static create(x: number, y: number, z: number, w: number): Quaternion;
    static createFromEuler(roll: number, pitch: number, yaw: number): Quaternion;
    static createFromAxisAndRadians(axis: Vector3, radians: number): Quaternion;
    static identity(): Quaternion;
    static add(a: Quaternion, b: Quaternion): Quaternion;
    static sub(a: Quaternion, b: Quaternion): Quaternion;
    static multiply(a: Quaternion, b: Quaternion): Quaternion;
    static scale(a: Quaternion, s: number): Quaternion;
    static dot(a: Quaternion, b: Quaternion): number;
    static conjugate(q: Quaternion): Quaternion;
    static normalize(q: Quaternion): Quaternion;
    static inverse(q: Quaternion): Quaternion;
    static rotateVector(q: Quaternion, v: Vector3): Vector3;
    static rotateVector(q: Quaternion, v: Vector4): Vector3;
    static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
    private static toQuaternion;
}
