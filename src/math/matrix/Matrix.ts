import { MatrixOperation } from "./MatrixOperation";

export abstract class Matrix<T extends Matrix<T>> implements MatrixOperation<T>{
    protected dimensionNum: number;
    protected data: Float32Array;

    constructor(dimensionNum: number, data?: Float32Array, initializeValue: number = 0){
        this.dimensionNum = dimensionNum;
        this.data = data ? 
                    new Float32Array(data) :
                    new Float32Array(dimensionNum * dimensionNum).fill(initializeValue);
    }

    get(rowIndex: number, colIndex: number): number{
        return this.data[this.dimensionNum * colIndex + rowIndex];
    }

    set(rowIndex: number, colIndex: number, value: number): void{
        this.data[this.dimensionNum * colIndex + rowIndex] = value;
    }

    get col(): number{
        return this.dimensionNum;
    }

    get row(): number{
        return this.dimensionNum;
    }

    get size(): number{
        return this.dimensionNum;
    }

    get elementSize(): number{
        return this.dimensionNum * this.dimensionNum;
    }

    toArray(): Float32Array{
        return this.data;
    }

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