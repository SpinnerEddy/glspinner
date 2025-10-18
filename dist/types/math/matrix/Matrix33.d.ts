import { Matrix } from "./Matrix";
import { Matrix44 } from "./Matrix44";
export declare class Matrix33 extends Matrix<Matrix33> {
    constructor(data?: Float32Array);
    identity(): Matrix33;
    add(other: Matrix33, out?: Matrix33): Matrix33;
    sub(other: Matrix33, out?: Matrix33): Matrix33;
    multiply(other: Matrix33, out?: Matrix33): Matrix33;
    multiply(other: number, out?: Matrix33): Matrix33;
    div(other: number, out?: Matrix33): Matrix33;
    transpose(): Matrix33;
    inverse(): Matrix33;
    clone(): Matrix33;
    fillNumber(value: number): void;
    normalMatrix(modelMatrix: Matrix44): Matrix33;
}
