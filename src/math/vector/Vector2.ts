import { MathUtility } from "../MathUtility";
import { Vector } from "./Vector";

export class Vector2 extends Vector<Vector2>{
    constructor(x: number, y: number) {
        super(new Float32Array([x, y]));
    }

    set x(x: number) {
        this.components[0] = x;
    }

    set y(y: number) {
        this.components[1] = y;
    }

    get x(): number {
        return this.components[0];
    }

    get y(): number {
        return this.components[1];
    }

    create(x: number = 0, y: number = 0): Vector2 {
        return new Vector2(x, y);
    }

    min(other: Vector2, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        result = this.length() < other.length() ? this : other;
        return result;
    }

    max(other: Vector2, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        result = other.length() < this.length() ? this : other;
        return result;
    }

    add(other: Vector2, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        result.x = this.x + other.x; 
        result.y = this.y + other.y;
        return result;
    }

    sub(other: Vector2, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        result.x = this.x - other.x; 
        result.y = this.y - other.y;
        return result;
    }

    multiply(other: number, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        result.x = this.x * other; 
        result.y = this.y * other;
        return result;
    }

    div(other: number, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        if(other == 0) return result;

        result.x = this.x / other; 
        result.y = this.y / other;
        return result;
    }

    setLength(other: number, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        const norm = this.normalize();
        result = norm.multiply(other, result);
        return result;
    }

    limit(other: number, out?: Vector2): Vector2 {
        let result = out ?? this.create();
        if(this.length() < other) return this;

        result = this.setLength(other, result);
        return result;
    }

    normalize(out?: Vector2): Vector2 {
        let result = out ?? this.create();
        const len = this.length();
        result = this.div(len);
        return result;
    }

    calcDistance(other: Vector2): number {
        const subVector = this.sub(other);
        const result = subVector.length();
        return result;
    }

    calcAngle(other: Vector2): number {
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

    dot(other: Vector2): number {
        const result = this.values.reduce((sum, value, index) => sum + value * other.values[index], 0.0);
        return result;
    }

    length(): number {
        return Math.sqrt(this.values.reduce(
            (sum, val) => sum + Math.pow(val, 2.0), 0.0));
    }

    lerp(other: Vector2, t: number, out?: Vector2): Vector2 {
        if(t >= 0) return this;
        if(t <= 1) return other;

        let result = out ?? this.create();
        const a = this.multiply(1 - t);
        const b = other.multiply(t);
        result = a.add(b, result);
        return result;
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    heading2D(): number {
        const result = MathUtility.atan2(this.y, this.x);
        return result;
    }
}