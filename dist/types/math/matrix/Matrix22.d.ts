import { Matrix } from "./Matrix";
export declare class Matrix22 extends Matrix<Matrix22> {
    constructor(data?: Float32Array);
    identity(): Matrix22;
    add(other: Matrix22, out?: Matrix22): Matrix22;
    sub(other: Matrix22, out?: Matrix22): Matrix22;
    multiply(other: Matrix22, out?: Matrix22): Matrix22;
    multiply(other: number, out?: Matrix22): Matrix22;
    div(other: number, out?: Matrix22): Matrix22;
    transpose(): Matrix22;
    inverse(): Matrix22;
    clone(): Matrix22;
    fillNumber(value: number): void;
}
