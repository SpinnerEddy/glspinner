import { MathUtility } from "../MathUtility";
import { Quaternion } from "../quaternion/Quaternion";
import { Vector2 } from "../vector/Vector2";
import { Vector3 } from "../vector/Vector3";
import { DefaultVectorConstants } from "../vector/VectorConstants";
import { VectorCalculator } from "../VectorCalculator";
import { Matrix } from "./Matrix";

export class Matrix44 extends Matrix<Matrix44>{

    constructor(data?: Float32Array){
        super(4, data);
    }

    identity(): Matrix44 {
        return new Matrix44(Float32Array.of(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ));
    }

    add(other: Matrix44, out?: Matrix44): Matrix44 {
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
        result[9] = a[9] + b[9];
        result[10] = a[10] + b[10];
        result[11] = a[11] + b[11];
        result[12] = a[12] + b[12];
        result[13] = a[13] + b[13];
        result[14] = a[14] + b[14];
        result[15] = a[15] + b[15];

        return out ?? new Matrix44(result);
    }

    sub(other: Matrix44, out?: Matrix44): Matrix44 {
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
        result[9] = a[9] - b[9];
        result[10] = a[10] - b[10];
        result[11] = a[11] - b[11];
        result[12] = a[12] - b[12];
        result[13] = a[13] - b[13];
        result[14] = a[14] - b[14];
        result[15] = a[15] - b[15];


        return out ?? new Matrix44(result);
    }

    multiply(other: Matrix44, out?: Matrix44): Matrix44;
    multiply(other: number, out?: Matrix44): Matrix44;
    multiply(other: Matrix44 | number, out?: Matrix44): Matrix44 {
        const result = out ?? new Matrix44();

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

    div(other: number, out?: Matrix44): Matrix44 {
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
        result[9] = a[9] / b;
        result[10] = a[10] / b;
        result[11] = a[11] / b;
        result[12] = a[12] / b;
        result[13] = a[13] / b;
        result[14] = a[14] / b;
        result[15] = a[15] / b;

        return out ?? new Matrix44(result);
    }

    transpose(): Matrix44 {
        const result = new Matrix44(new Float32Array(this.elementSize));
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.col; j++){
                result.set(j, i, this.get(i, j));
            }    
        }
        return result;
    }

    inverse(): Matrix44 {
        const a = this.get(0, 0);
        const b = this.get(0, 1);
        const c = this.get(0, 2);
        const d = this.get(0, 3);
        const e = this.get(1, 0);
        const f = this.get(1, 1);
        const g = this.get(1, 2);
        const h = this.get(1, 3);
        const i = this.get(2, 0);
        const j = this.get(2, 1);
        const k = this.get(2, 2);
        const l = this.get(2, 3);
        const m = this.get(3, 0);
        const n = this.get(3, 1);
        const o = this.get(3, 2);
        const p = this.get(3, 3);

        const det = a*f*k*p + a*g*l*n + a*h*j*o 
                    - a*h*k*n - a*g*j*p - a*f*l*o
                    - b*e*k*p - c*e*l*n - d*e*j*o
                    + d*e*k*n + c*e*j*p + b*e*l*o
                    + b*g*i*p + c*h*i*n + d*f*i*o
                    - d*g*i*n - c*f*i*p - b*h*i*o
                    - b*g*l*m - c*h*j*m - d*f*k*m
                    + d*g*j*m + c*f*l*m + b*h*k*m;
        const result = new Matrix44();
        if(det == 0){
            return result;
        }

        const invDet = 1 / det;
        result.set(0, 0, (f*k*p + g*l*n + h*j*o - h*k*n - g*j*p - f*l*o) * invDet);
        result.set(0, 1, (-b*k*p - c*l*n - d*j*o + d*k*n + c*j*p + b*l*o) * invDet);
        result.set(0, 2, (b*g*p + c*h*n + d*f*o - d*g*n - c*f*p - b*h*o) * invDet);
        result.set(0, 3, (-b*g*l - c*h*j - d*f*k + d*g*j + c*f*l + b*h*k) * invDet);
        result.set(1, 0, (-e*k*p - g*l*m - h*i*o + h*k*m + g*i*p + e*l*o) * invDet);
        result.set(1, 1, (a*k*p + c*l*m + d*i*o - d*k*m - c*i*p - a*l*o) * invDet);
        result.set(1, 2, (-a*g*p - c*h*m - d*e*o + d*g*m + c*e*p + a*h*o) * invDet);
        result.set(1, 3, (a*g*l + c*h*i + d*e*k - d*g*i - c*e*l - a*h*k) * invDet);
        result.set(2, 0, (e*j*p + f*l*m + h*i*n - h*j*m - f*i*p - e*l*n) * invDet);
        result.set(2, 1, (-a*j*p - b*l*m - d*i*n + d*j*m + b*i*p + a*l*n) * invDet);
        result.set(2, 2, (a*f*p + b*h*m + d*e*n - d*f*m - b*e*p - a*h*n) * invDet);
        result.set(2, 3, (-a*f*l - b*h*i - d*e*j + d*f*i + b*e*l + a*h*j) * invDet);
        result.set(3, 0, (-e*j*o - f*k*m - g*i*n + g*j*m + f*i*o + e*k*n) * invDet);
        result.set(3, 1, (a*j*o + b*k*m + c*i*n - c*j*m - b*i*o - a*k*n) * invDet);
        result.set(3, 2, (-a*f*o - b*g*m - c*e*n + c*f*m + b*e*o + a*g*n) * invDet);
        result.set(3, 3, (a*f*k + b*g*i + c*e*j - c*f*i - b*e*k - a*g*j) * invDet);
        return result;
    }

    clone(): Matrix44 {
        return new Matrix44(this.data);
    }

    fillNumber(value: number): void {
        this.data.fill(value);
    }

    orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, out?: Matrix44): Matrix44 {
        const width = right - left;
        const height = top - bottom;
        const depth = far - near;

        if(width == 0){
            throw new Error('Right and Left are same value. Cannot calculate orthographic.');
        }
        if(height == 0){
            throw new Error('Top and bottom are same value. Cannot calculate orthographic.');
        }
        if(depth == 0){
            throw new Error('Far and Near are same value. Cannot calculate orthographic.');
        }

        const rw = 1 / width;
        const rh = 1 / height;
        const rd = 1 / depth;

        const result = out ? out : new Matrix44();
        result.set(0, 0, 2 * rw);
        result.set(1, 1, 2 * rh);
        result.set(2, 2, -2 * rd);
        result.set(3, 3, 1);
        result.set(0, 3, -(right + left) * rw);
        result.set(1, 3, -(top + bottom) * rh);
        result.set(2, 3, -(far + near) * rd);
        return result;
    }

    perspective(fovDegrees: number, width: number, height:number, near: number, far: number, out?: Matrix44): Matrix44 {
        if(height == 0){
            throw new Error('Height is zero!');
        }
        const aspect = width / height;

        const depth = far - near;
        if(depth == 0){
            throw new Error('depth is zero!');
        }

        const fovRadians = MathUtility.degreesToRadians(fovDegrees);
        const tanValue = MathUtility.tan(fovRadians / 2);
        const result = out ? out : new Matrix44();
        result.set(0, 0, 1 / (tanValue * aspect));
        result.set(1, 1, 1 / tanValue);
        result.set(2, 2, -(far + near) / depth);
        result.set(2, 3, -(2 * far * near) / depth);
        result.set(3, 2, -1);

        return result;
    }

    lookAt(eyePos: Vector3, targetPos: Vector3, up: Vector3, out?: Matrix44): Matrix44 {
        const f = VectorCalculator.normalize(VectorCalculator.sub(targetPos, eyePos));
        const r = VectorCalculator.normalize(VectorCalculator.cross(f, up));
        const u = VectorCalculator.normalize(VectorCalculator.cross(r, f));
        let result = out ? out : new Matrix44();
        result = result.identity();
        result.set(0, 0, r.x);
        result.set(1, 0, r.y);
        result.set(2, 0, r.z);
        result.set(0, 1, u.x);
        result.set(1, 1, u.y);
        result.set(2, 1, u.z);
        result.set(0, 2, -f.x);
        result.set(1, 2, -f.y);
        result.set(2, 2, -f.z);
        result.set(0, 3, -VectorCalculator.dot(r, eyePos));
        result.set(1, 3, -VectorCalculator.dot(u, eyePos));
        result.set(2, 3, -VectorCalculator.dot(f, eyePos));

        return result;
    }

    translate2D(offset: Vector2, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();
        const translateMatrix = this.identity();
        translateMatrix.set(0, 3, offset.x);
        translateMatrix.set(1, 3, offset.y);

        result = translateMatrix.multiply(this);
        return result;
    }

    translate3D(offset: Vector3, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();
        const translateMatrix = this.identity();
        translateMatrix.set(0, 3, offset.x);
        translateMatrix.set(1, 3, offset.y);
        translateMatrix.set(2, 3, offset.z);

        result = translateMatrix.multiply(this);
        return result;
    }

    rotateX(angle: number, out?: Matrix44): Matrix44 {
        return this.rotate3D(angle, DefaultVectorConstants.AXIS2DX, out);
    }

    rotateY(angle: number, out?: Matrix44): Matrix44 {
        return this.rotate3D(angle, DefaultVectorConstants.AXIS2DY, out);
    }

    rotateZ(angle: number, out?: Matrix44): Matrix44 {
        return this.rotate3D(angle, DefaultVectorConstants.AXIS2DZ, out);
    }

    rotate2D(angle: number, out?: Matrix44): Matrix44 {
        return this.rotateZ(angle, out);
    }

    rotate3D(angle: number, axis: Vector3, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();

        const rotateMatrix = this.createRotateMatrix3D(angle, axis);
        result = rotateMatrix.multiply(this);
        return result;
    }

    rotateByQuaternion(rotation: Quaternion, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();

        const rotateMatrix = rotation.toMatrix();
        result = rotateMatrix.multiply(this);
        return result;
    }

    scale2D(scaleX: number, scaleY: number, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();

        const rotateMatrix = this.createScaleMatrix2D(scaleX, scaleY);
        result = rotateMatrix.multiply(this);
        return result;
    }

    scale3D(scaleX: number, scaleY: number, scaleZ: number, out?: Matrix44): Matrix44 {
        let result = out ? out : new Matrix44();

        const scaleMatrix = this.createScaleMatrix3D(scaleX, scaleY, scaleZ);
        result = scaleMatrix.multiply(this);
        return result;
    }

    private createRotateMatrix3D(angle: number, axis: Vector3): Matrix44 {
        const rotateMatrix = this.identity();
        if(axis == DefaultVectorConstants.AXIS2DX){
            rotateMatrix.set(1, 1, MathUtility.cos(angle));
            rotateMatrix.set(1, 2, -MathUtility.sin(angle));
            rotateMatrix.set(2, 1, MathUtility.sin(angle));
            rotateMatrix.set(2, 2, MathUtility.cos(angle));
        }
        if(axis == DefaultVectorConstants.AXIS2DY){
            rotateMatrix.set(0, 0, MathUtility.cos(angle));
            rotateMatrix.set(0, 2, MathUtility.sin(angle));
            rotateMatrix.set(2, 0, -MathUtility.sin(angle));
            rotateMatrix.set(2, 2, MathUtility.cos(angle));
        }
        if(axis == DefaultVectorConstants.AXIS2DZ){
            rotateMatrix.set(0, 0, MathUtility.cos(angle));
            rotateMatrix.set(0, 1, -MathUtility.sin(angle));
            rotateMatrix.set(1, 0, MathUtility.sin(angle));
            rotateMatrix.set(1, 1, MathUtility.cos(angle));
        }
        return rotateMatrix;
    }

    private createScaleMatrix2D(scalarX: number, scalarY: number): Matrix44 {
        const scaleMatrix = this.identity();
        scaleMatrix.set(0, 0, scalarX);
        scaleMatrix.set(1, 1, scalarY);

        return scaleMatrix;
    }

    private createScaleMatrix3D(scalarX: number, scalarY: number, scalarZ: number): Matrix44 {
        const scaleMatrix = this.identity();
        scaleMatrix.set(0, 0, scalarX);
        scaleMatrix.set(1, 1, scalarY);
        scaleMatrix.set(2, 2, scalarZ);

        return scaleMatrix;
    }
}