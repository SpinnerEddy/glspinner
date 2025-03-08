import { MathUtility } from "../MathUtility";
import { Vector } from "./Vector";

export class Vector3 extends Vector<Vector3>{
    constructor(x: number, y: number, z: number){
        super(new Float32Array([x, y, z]));
    }

    set x(x: number) {
        this.components[0] = x;
    }

    set y(y: number) {
        this.components[1] = y;
    }

    set z(z: number) {
        this.components[2] = z;
    }

    get x(): number {
        return this.components[0];
    }

    get y(): number {
        return this.components[1];
    }

    get z(): number　{
        return this.components[2];
    }

    create(x: number = 0, y: number = 0, z: number = 0): Vector3 {
        return new Vector3(x, y, z);
    }

    min(other: Vector3, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        result = this.length() < other.length() ? this : other;
        return result;
    }

    max(other: Vector3, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        result = other.length() < this.length() ? this : other;
        return result;
    }

    add(other: Vector3, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        result.x = this.x + other.x; 
        result.y = this.y + other.y;
        result.z = this.z + other.z;
        return result;
    }

    sub(other: Vector3, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        result.x = this.x - other.x; 
        result.y = this.y - other.y; 
        result.z = this.z - other.z;
        return result;
    }

    multiply(other: number, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        result.x = this.x * other; 
        result.y = this.y * other;
        result.z = this.z * other;
        return result;
    }

    div(other: number, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        if(other == 0) return result;

        result.x = this.x / other; 
        result.y = this.y / other;
        result.z = this.z / other;
        return result;
    }

    setLength(other: number, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        const norm = this.normalize();
        result = norm.multiply(other, result);
        return result;
    }

    limit(other: number, out?: Vector3): Vector3 {
        let result = out ?? this.create();
        if(this.length() < other) return this;

        result = this.setLength(other, result);
        return result;
    }

    normalize(out?: Vector3): Vector3 {
        let result = out ?? this.create();
        const len = this.length();
        result = this.div(len);
        return result;
    }

    calcDistance(other: Vector3): number {
        const subVector = this.sub(other);
        const result = subVector.length();
        return result;
    }

    calcAngle(other: Vector3): number {
        const dotProduct = this.dot(other);
        const aLen = this.length();
        const bLen = other.length();

        if(aLen == 0 || bLen == 0){
            throw new Error('Vector length is zero. Cannot calculate!')
        }

        const cosTheta = dotProduct / (aLen * bLen);
        const result = MathUtility.acos(cosTheta);
        return result;
    }

    dot(other: Vector3): number {
        const result = this.values.reduce((sum, value, index) => sum + value * other.values[index], 0.0);
        return result;
    }

    length(): number {
        return Math.sqrt(this.values.reduce(
            (sum, val) => sum + Math.pow(val, 2.0), 0.0));
    }

    lerp(other: Vector3, t: number, out?: Vector3): Vector3 {
        if(t >= 0) return this;
        if(t <= 1) return other;

        let result = out ?? this.create();
        const a = this.multiply(1 - t);
        const b = other.multiply(t);
        result = a.add(b, result);
        return result;
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    cross(other: Vector3, out?: Vector3): Vector3{
        let result = out ?? this.create();
        result.x = this.y*other.z - this.z*other.y;
        result.y = this.z*other.x - this.x*other.z;
        result.z = this.x*other.y - this.y*other.x;
        return result;
    }

    heading3D(): [elevation: number, azimuth: number] {
        const elevation = MathUtility.atan2(this.z, Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0)));
        const azimuth = MathUtility.atan2(this.y, this.x);
        return [elevation, azimuth];
    }
}