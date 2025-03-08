import { Matrix } from "./Matrix";

export class Matrix22 extends Matrix<Matrix22>{

    constructor(data?: Float32Array){
        super(2, data);
    }

    identity(): Matrix22 {
        return new Matrix22(Float32Array.of(
            1, 0,
            0, 1
        ));
    }

    add(other: Matrix22, out?: Matrix22): Matrix22 {
        const a = this.data;
        const b = other.data;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
        result[2] = a[2] + b[2];
        result[3] = a[3] + b[3];

        return out ?? new Matrix22(result);
    }

    sub(other: Matrix22, out?: Matrix22): Matrix22 {
        const a = this.data;
        const b = other.data;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] - b[0];
        result[1] = a[1] - b[1];
        result[2] = a[2] - b[2];
        result[3] = a[3] - b[3];

        return out ?? new Matrix22(result);
    }

    multiply(other: Matrix22, out?: Matrix22): Matrix22;
    multiply(other: number, out?: Matrix22): Matrix22;
    multiply(other: Matrix22 | number, out?: Matrix22): Matrix22 {
        const result = out ?? new Matrix22(new Float32Array(this.elementSize));

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

    div(other: number, out?: Matrix22): Matrix22 {
        const a = this.data;
        const b = other;
        const result = out ? out.data : new Float32Array(this.elementSize);

        result[0] = a[0] / b;
        result[1] = a[1] / b;
        result[2] = a[2] / b;
        result[3] = a[3] / b;

        return out ?? new Matrix22(result);
    }

    transpose(): Matrix22 {
        const result = new Matrix22(new Float32Array(this.elementSize));
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                result.set(j, i, this.get(i, j));
            }    
        }
        return result;
    }

    inverse(): Matrix22 {
        const a = this.get(0, 0);
        const b = this.get(0, 1);
        const c = this.get(1, 0);
        const d = this.get(1, 1);

        const det = a*d - b*c;
        const result = new Matrix22();
        if(det == 0){
            return result;
        }

        const invDet = 1 / det;
        result.set(0, 0, d * invDet);
        result.set(0, 1, -b * invDet);
        result.set(1, 0, -c * invDet);
        result.set(1, 1, a * invDet);
        return result;
    }

    clone(): Matrix22 {
        return new Matrix22(this.data);
    }

    fillNumber(value: number): void {
        this.data.fill(value);
    }
}