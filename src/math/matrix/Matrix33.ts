import { Matrix } from "./Matrix";
import { Matrix44 } from "./Matrix44";

export class Matrix33 extends Matrix<Matrix33>{

    constructor(data?: Float32Array){
        super(3, data);
    }

    identity(): Matrix33 {
        return new Matrix33(Float32Array.of(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ));
    }

    add(other: Matrix33, out?: Matrix33): Matrix33 {
        const a = this.data;
        const b = other.data;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
        result[2] = a[2] + b[2];
        result[3] = a[3] + b[3];
        result[4] = a[4] + b[4];
        result[5] = a[5] + b[5];
        result[6] = a[6] + b[6];
        result[7] = a[7] + b[7];
        result[8] = a[8] + b[8];

        return out ?? new Matrix33(result);
    }

    sub(other: Matrix33, out?: Matrix33): Matrix33 {
        const a = this.data;
        const b = other.data;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] - b[0];
        result[1] = a[1] - b[1];
        result[2] = a[2] - b[2];
        result[3] = a[3] - b[3];
        result[4] = a[4] - b[4];
        result[5] = a[5] - b[5];
        result[6] = a[6] - b[6];
        result[7] = a[7] - b[7];
        result[8] = a[8] - b[8];

        return out ?? new Matrix33(result);
    }

    multiply(other: Matrix33, out?: Matrix33): Matrix33;
    multiply(other: number, out?: Matrix33): Matrix33;
    multiply(other: Matrix33 | number, out?: Matrix33): Matrix33 {
        const result = out ?? new Matrix33(new Float32Array(this.elementSize));

        if(other instanceof Matrix){
            for(let rowIndex = 0; rowIndex < this.row; rowIndex++){
                for(let colIndex = 0; colIndex < other.col; colIndex++){
                    let sum = 0;
                    for(let k = 0; k < this.col; k++){
                        sum += this.get(rowIndex, k) * other.get(k, colIndex);
                    }
                    result.set(rowIndex, colIndex, sum);
                }
            }
        }
        else{
            for(let rowIndex = 0; rowIndex < this.row; rowIndex++){
                for(let colIndex = 0; colIndex < this.col; colIndex++){
                    result.set(rowIndex, colIndex, this.get(rowIndex, colIndex) * other);
                }
            }
        }

        return result;
    }

    div(other: number, out?: Matrix33): Matrix33 {
        const a = this.data;
        const b = other;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] / b;
        result[1] = a[1] / b;
        result[2] = a[2] / b;
        result[3] = a[3] / b;
        result[4] = a[4] / b;
        result[5] = a[5] / b;
        result[6] = a[6] / b;
        result[7] = a[7] / b;
        result[8] = a[8] / b;

        return out ?? new Matrix33(result);
    }

    transpose(): Matrix33 {
        const result = new Matrix33(new Float32Array(this.elementSize));
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                result.set(j, i, this.get(i, j));
            }    
        }
        return result;
    }

    inverse(): Matrix33 {
        const a = this.get(0, 0);
        const b = this.get(0, 1);
        const c = this.get(0, 2);
        const d = this.get(1, 0);
        const e = this.get(1, 1);
        const f = this.get(1, 2);
        const g = this.get(2, 0);
        const h = this.get(2, 1);
        const i = this.get(2, 2);

        const det = a*e*i + b*f*g + c*d*h - c*e*g - b*d*i - a*f*h;
        const result = new Matrix33();
        if(det == 0){
            return result;
        }
        
        const invDet = 1 / det;
        result.set(0, 0,  (e*i - f*h) * invDet);
        result.set(0, 1, -(b*i - c*h) * invDet);
        result.set(0, 2,  (b*f - c*e) * invDet);
        result.set(1, 0, -(d*i - f*g) * invDet);
        result.set(1, 1,  (a*i - c*g) * invDet);
        result.set(1, 2, -(a*f - c*d) * invDet);
        result.set(2, 0,  (d*h - e*g) * invDet);
        result.set(2, 1, -(a*h - b*g) * invDet);
        result.set(2, 2,  (a*e - b*d) * invDet);
        return result;
    }

    clone(): Matrix33 {
        return new Matrix33(this.data);
    }

    fillNumber(value: number): void {
        this.data.fill(value);
    }

    normalMatrix(modelMatrix: Matrix44): Matrix33 {
        const subMatrix = new Matrix33(Float32Array.of(
            modelMatrix.get(0, 0), modelMatrix.get(0, 1), modelMatrix.get(0, 2),
            modelMatrix.get(1, 0), modelMatrix.get(1, 1), modelMatrix.get(1, 2),
            modelMatrix.get(2, 0), modelMatrix.get(2, 1), modelMatrix.get(2, 2), 
        ));

        return subMatrix.inverse();
    }
}