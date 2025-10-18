import { MatrixOperation } from "./MatrixOperation";
export declare abstract class Matrix<T extends Matrix<T>> implements MatrixOperation<T> {
    protected dimensionNum: number;
    protected data: Float32Array;
    constructor(dimensionNum: number, data?: Float32Array, initializeValue?: number);
    get(rowIndex: number, colIndex: number): number;
    set(rowIndex: number, colIndex: number, value: number): void;
    get col(): number;
    get row(): number;
    get size(): number;
    get elementSize(): number;
    toArray(): Float32Array;
    abstract identity(): T;
    abstract add(other: T, out?: T): T;
    abstract sub(other: T, out?: T): T;
    abstract multiply(other: number, out?: T): T;
    abstract multiply(other: T, out?: T): T;
    abstract div(other: number, out?: T): T;
    abstract transpose(): T;
    abstract inverse(): T;
    abstract clone(): T;
    abstract fillNumber(value: number): void;
}
