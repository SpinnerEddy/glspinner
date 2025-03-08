import { MathUtility } from "./MathUtility";
import { Quaternion } from "./quaternion/Quaternion";
import { Vector3 } from "./vector/Vector3";
import { Vector4 } from "./vector/Vector4";
import { VectorCalculator } from "./VectorCalculator";

export class QuaternionCalculator{
    static create(x: number, y: number, z: number, w: number): Quaternion{
        return new Quaternion(x, y, z, w);
    }

    static createFromEuler(roll: number, pitch: number, yaw: number){
        const h = QuaternionCalculator.create(0, -MathUtility.sin(pitch * 0.5), 0, MathUtility.cos(pitch * 0.5));
        const p = QuaternionCalculator.create(-MathUtility.sin(roll * 0.5), 0, 0, MathUtility.cos(roll * 0.5));
        const b = QuaternionCalculator.create(0, 0, -MathUtility.sin(yaw * 0.5), MathUtility.cos(yaw * 0.5));

        const hp = QuaternionCalculator.multiply(h, p);
        const hpb = QuaternionCalculator.multiply(hp, b);
        return hpb;
    }

    static createFromAxisAndRadians(axis: Vector3, radians: number){
        const normalizeAxis = VectorCalculator.normalize(axis);
        const h = radians * 0.5;
        const s = MathUtility.sin(h);

        return QuaternionCalculator.create(normalizeAxis.x * s, normalizeAxis.y * s, normalizeAxis.z * s, MathUtility.cos(h));
    }

    static identity(): Quaternion{
        return new Quaternion(0, 0, 0, 1);
    }

    static add(a: Quaternion, b: Quaternion): Quaternion{
        const x = a.x + b.x;
        const y = a.y + b.y;
        const z = a.z + b.z;
        const w = a.w + b.w;

        return QuaternionCalculator.create(x, y, z, w);
    }

    static sub(a: Quaternion, b: Quaternion): Quaternion{
        const x = a.x - b.x;
        const y = a.y - b.y;
        const z = a.z - b.z;
        const w = a.w - b.w;

        return QuaternionCalculator.create(x, y, z, w);
    }

    static multiply(a: Quaternion, b: Quaternion): Quaternion{
        const w = a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z;
        const x = a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y;
        const y = a.w*b.y + a.y*b.w + a.z*b.x - a.x*b.z;
        const z = a.w*b.z + a.z*b.w + a.x*b.y - a.y*b.x;

        return QuaternionCalculator.create(x, y, z, w);
    }

    static scale(a: Quaternion, s: number): Quaternion{
        const x = a.x * s;
        const y = a.y * s;
        const z = a.z * s;
        const w = a.w * s;

        return QuaternionCalculator.create(x, y, z, w);
    }

    static dot(a: Quaternion, b: Quaternion): number{
        return a.x*b.x + a.y*b.y + a.z*b.z + a.w*b.w;
    }

    static conjugate(q: Quaternion): Quaternion{
        return QuaternionCalculator.create(-q.x, -q.y, -q.z, q.w);
    }

    static normalize(q: Quaternion): Quaternion{
        const length = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w);
        if(length == 0){
            throw new Error("Zero length quaternion. Cannot normalize!!")
        }

        const invLength = 1 / length;

        return QuaternionCalculator.scale(q, invLength);
    }

    static inverse(q: Quaternion): Quaternion{
        const lengthSquared = q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w;
        if(lengthSquared == 0){
            throw new Error("Zero length quaternion. Cannot inverse!!")
        }

        const invLengthSquared = 1 / lengthSquared;
        const conjugate = QuaternionCalculator.conjugate(q);
        return QuaternionCalculator.scale(conjugate, invLengthSquared);
    }

    static rotateVector(q: Quaternion, v: Vector3): Vector3
    static rotateVector(q: Quaternion, v: Vector4): Vector3
    static rotateVector(q: Quaternion, v: Vector3 | Vector4): Vector3{
        const qVec = QuaternionCalculator.toQuaternion(v);
        const inverse = QuaternionCalculator.inverse(q);

        const temp = QuaternionCalculator.multiply(q, qVec);
        const result = QuaternionCalculator.multiply(temp, inverse);

        return new Vector3(result.x, result.y, result.z);
    }

    static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion{
        let dot = QuaternionCalculator.dot(a, b);
        if(dot < 0.0){
            b = QuaternionCalculator.scale(b, -1);
            dot *= -1;
        }

        const theta = Math.acos(dot);
        const sinTheta = MathUtility.sin(theta);
        if(sinTheta == 0){
            const q1 = QuaternionCalculator.scale(a, 1 - t);
            const q2 = QuaternionCalculator.scale(b, t);
            return QuaternionCalculator.add(q1, q2);
        }
        else{
            const q1 = QuaternionCalculator.scale(a, MathUtility.sin(theta * (1 - t)) / sinTheta);
            const q2 = QuaternionCalculator.scale(b, MathUtility.sin(theta * t) / sinTheta);
            return QuaternionCalculator.add(q1, q2);
        }
    }

    private static toQuaternion(vector: Vector3 | Vector4): Quaternion{
        return QuaternionCalculator.create(vector.x, vector.y, vector.z, 0);
    }
}