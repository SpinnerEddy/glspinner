export interface VectorOperation<T> {
    min(other: T, out?: T): T;
    max(other: T, out?: T): T;
    add(other: T, out?: T): T;
    sub(other: T, out?: T): T;
    multiply(other: number, out?: T): T;
    div(other: number, out?: T): T;
    setLength(other: number, out?: T): T;
    limit(other: number, out?: T): T;
    normalize(out?: T): T;
    calcAngle(other: T): number;
    calcDistance(other: T): number;
    dot(other: T): number;
    length(): number;
    lerp(other: T, t: number, out?: T): T;
    clone(): T;
}
