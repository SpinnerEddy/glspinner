export interface MatrixOperation<T> {
    identity(): T;
    add(other: T, out?: T): T;
    sub(other: T, out?: T): T;
    multiply(other: number, out?: T): T;
    multiply(other: T, out?: T): T;
    div(other: number, out?: T): T;
    transpose(): T;
    inverse(): T;
    clone(): T;
    fillNumber(value: number): void;
}
