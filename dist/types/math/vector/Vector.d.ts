import { VectorOperation } from "./VectorOperation";
export declare abstract class Vector<T extends Vector<T>> implements VectorOperation<T> {
    protected components: Float32Array;
    constructor(components: Float32Array);
    get values(): Float32Array;
    get size(): number;
    get(index: number): number;
    abstract min(other: T, out?: T): T;
    abstract max(other: T, out?: T): T;
    abstract add(other: T, out?: T): T;
    abstract sub(other: T, out?: T): T;
    abstract multiply(other: number, out?: T): T;
    abstract div(other: number, out?: T): T;
    abstract setLength(other: number, out?: T): T;
    abstract limit(other: number, out?: T): T;
    abstract normalize(out?: T): T;
    abstract calcDistance(other: T): number;
    abstract calcAngle(other: T): number;
    abstract dot(other: T): number;
    abstract length(): number;
    abstract lerp(other: T, t: number, out?: T): T;
    abstract clone(): T;
}
