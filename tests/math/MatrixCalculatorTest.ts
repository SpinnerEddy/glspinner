import { QuaternionCalculator } from "../../src/math/QuaternionCalculator";
import { Matrix44 } from "../../src/math/matrix/Matrix44";
import { MatrixCalculator } from "../../src/math/MatrixCalculator";
import { Vector2 } from "../../src/math/vector/Vector2";
import { Vector3 } from "../../src/math/vector/Vector3";
import { DefaultVectorConstants,  } from "../../src/math/vector/VectorConstants";
import { MathUtility } from "../../src/math/MathUtility";

test("Matrix Add", () => {
    let matrixA = MatrixCalculator.identity22();
    let matrixB = MatrixCalculator.identity22();

    matrixA.set(0, 1, 2);
    matrixA.set(1, 0, 3);
    matrixB.set(0, 1, 2);
    matrixB.set(1, 0, 3);

    let result = MatrixCalculator.add(matrixA, matrixB);
    let exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 2);
    exceptResult.set(0, 1, 4);
    exceptResult.set(1, 0, 6);
    exceptResult.set(1, 1, 2);

    expect(result).toEqual(exceptResult);
});

test("Matrix Multiply number", () => {
    let matrixA = MatrixCalculator.identity22();

    let result = MatrixCalculator.multiply(matrixA, 5);
    let exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 0);
    exceptResult.set(1, 0, 0);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});

test("Matrix Multiply Matrix", () => {
    let matrixA = MatrixCalculator.identity22();
    let matrixB = MatrixCalculator.identity22();

    matrixA = MatrixCalculator.multiply(matrixA, 5);
    matrixB.set(0, 1, 3);
    matrixB.set(1, 0, 2);
    let result = MatrixCalculator.multiply(matrixA, matrixB);

    let exceptResult = MatrixCalculator.identity22();
    exceptResult.identity();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 15);
    exceptResult.set(1, 0, 10);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});

test("Matrix Multiply Matrix", () => {
    let matrixA = MatrixCalculator.identity22();
    let matrixB = MatrixCalculator.identity22();

    matrixA = MatrixCalculator.multiply(matrixA, 5);
    matrixB.set(0, 1, 3);
    matrixB.set(1, 0, 2);
    let result = MatrixCalculator.multiply(matrixA, matrixB);

    let exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 15);
    exceptResult.set(1, 0, 10);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});


test("Vector Translate2D", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 2);
    let translateVector = new Vector2(3, 4);

    let result = MatrixCalculator.translate2D(mat, translateVector);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 4);
    exceptResult.set(1, 3, 6);

    expect(result).toEqual(exceptResult);
});

test("Vector Translate3D 1", () => {
    let mat = MatrixCalculator.identity44();
    let translateVector = new Vector3(1, 2, 3);

    let result = MatrixCalculator.translate3D(mat, translateVector);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 1);
    exceptResult.set(1, 3, 2);
    exceptResult.set(2, 3, 3);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test("Vector Translate3D 2", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 5);
    mat.set(1, 3, -5);
    mat.set(2, 3, 10);
    let translateVector = new Vector3(2, 3, -4);

    let result = MatrixCalculator.translate3D(mat, translateVector);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 7);
    exceptResult.set(1, 3, -2);
    exceptResult.set(2, 3, 6);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test("Vector Translate3D 3", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 5);
    mat.set(1, 3, -5);
    mat.set(2, 3, 10);
    let translateVector = new Vector3(0, 0, 0);

    let result = MatrixCalculator.translate3D(mat, translateVector);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 5);
    exceptResult.set(1, 3, -5);
    exceptResult.set(2, 3, 10);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test("Vector rotate2D 1", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    let angle = Math.PI * 0.5;

    let result = MatrixCalculator.rotate2D(mat, angle);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 1, -1);
    exceptResult.set(1, 0, 1);
    exceptResult.set(1, 1, 0);
    exceptResult.set(1, 3, 1);

    expect(result).toEqual(exceptResult);
});

test("Vector rotate2D 2", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    let angle = Math.PI;

    let result = MatrixCalculator.rotate2D(mat, angle);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, -1);
    exceptResult.set(0, 3, -1);
    exceptResult.set(1, 1, -1);

    expect(result).toEqual(exceptResult);
});

test("Vector rotate3D 1", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    mat.set(2, 3, 0);
    let angle = Math.PI * 0.5;

    let result = MatrixCalculator.rotate3D(mat, angle, DefaultVectorConstants.AXIS2DY);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 2, 1);
    exceptResult.set(2, 0, -1);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, -1);

    expect(result).toEqual(exceptResult);
});

test("Vector rotate3D 2", () => {
    let mat = MatrixCalculator.identity44();
    mat.set(0, 3, 0);
    mat.set(1, 3, 1);
    mat.set(2, 3, 0);
    let angle = Math.PI * 0.5;

    let result = MatrixCalculator.rotate3D(mat, angle, DefaultVectorConstants.AXIS2DX);
    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(1, 1, 0);
    exceptResult.set(1, 2, -1);
    exceptResult.set(2, 1, 1);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, 1);

    expect(result).toEqual(exceptResult);
});

test("rotate Quaternion", () => {
    let rotation = QuaternionCalculator.createFromAxisAndRadians(DefaultVectorConstants.AXIS2DY, MathUtility.degreesToRadians(90));
    let result = MatrixCalculator.identity44();
    result = MatrixCalculator.rotateByQuaternion(result, rotation);

    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 1, 0);
    exceptResult.set(0, 2, 1);
    exceptResult.set(0, 3, 0);
    exceptResult.set(1, 0, 0);
    exceptResult.set(1, 1, 1);
    exceptResult.set(1, 2, 0);
    exceptResult.set(1, 3, 0);
    exceptResult.set(2, 0, -1);
    exceptResult.set(2, 1, 0);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, 0);
    exceptResult.set(3, 0, 0);
    exceptResult.set(3, 1, 0);
    exceptResult.set(3, 2, 0);
    exceptResult.set(3, 3, 1);

    expect(result.get(0, 0)).toBeCloseTo(exceptResult.get(0, 0));
    expect(result.get(0, 1)).toBeCloseTo(exceptResult.get(0, 1));
    expect(result.get(0, 2)).toBeCloseTo(exceptResult.get(0, 2));
    expect(result.get(0, 3)).toBeCloseTo(exceptResult.get(0, 3));
    expect(result.get(1, 0)).toBeCloseTo(exceptResult.get(1, 0));
    expect(result.get(1, 1)).toBeCloseTo(exceptResult.get(1, 1));
    expect(result.get(1, 2)).toBeCloseTo(exceptResult.get(1, 2));
    expect(result.get(1, 3)).toBeCloseTo(exceptResult.get(1, 3));
    expect(result.get(2, 0)).toBeCloseTo(exceptResult.get(2, 0));
    expect(result.get(2, 1)).toBeCloseTo(exceptResult.get(2, 1));
    expect(result.get(2, 2)).toBeCloseTo(exceptResult.get(2, 2));
    expect(result.get(2, 3)).toBeCloseTo(exceptResult.get(2, 3));
    expect(result.get(3, 0)).toBeCloseTo(exceptResult.get(3, 0));
    expect(result.get(3, 1)).toBeCloseTo(exceptResult.get(3, 1));
    expect(result.get(3, 2)).toBeCloseTo(exceptResult.get(3, 2));
    expect(result.get(3, 3)).toBeCloseTo(exceptResult.get(3, 3));
});

test("Calculate Local Matrix", () => {
    let position = new Vector3(10, 0, 0);
    let scale = new Vector3(2, 2, 2);
    let rotation = QuaternionCalculator.createFromAxisAndRadians(DefaultVectorConstants.AXIS2DY, MathUtility.degreesToRadians(90));
    let result = MatrixCalculator.identity44();
    result = MatrixCalculator.scale3D(result, scale.x, scale.y, scale.z);
    result = MatrixCalculator.rotateByQuaternion(result, rotation);
    result = MatrixCalculator.translate3D(result, position);

    let exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 1, 0);
    exceptResult.set(0, 2, 2);
    exceptResult.set(0, 3, 10);
    exceptResult.set(1, 0, 0);
    exceptResult.set(1, 1, 2);
    exceptResult.set(1, 2, 0);
    exceptResult.set(1, 3, 0);
    exceptResult.set(2, 0, -2);
    exceptResult.set(2, 1, 0);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, 0);
    exceptResult.set(3, 0, 0);
    exceptResult.set(3, 1, 0);
    exceptResult.set(3, 2, 0);
    exceptResult.set(3, 3, 1);

    expect(result.get(0, 0)).toBeCloseTo(exceptResult.get(0, 0));
    expect(result.get(0, 1)).toBeCloseTo(exceptResult.get(0, 1));
    expect(result.get(0, 2)).toBeCloseTo(exceptResult.get(0, 2));
    expect(result.get(0, 3)).toBeCloseTo(exceptResult.get(0, 3));
    expect(result.get(1, 0)).toBeCloseTo(exceptResult.get(1, 0));
    expect(result.get(1, 1)).toBeCloseTo(exceptResult.get(1, 1));
    expect(result.get(1, 2)).toBeCloseTo(exceptResult.get(1, 2));
    expect(result.get(1, 3)).toBeCloseTo(exceptResult.get(1, 3));
    expect(result.get(2, 0)).toBeCloseTo(exceptResult.get(2, 0));
    expect(result.get(2, 1)).toBeCloseTo(exceptResult.get(2, 1));
    expect(result.get(2, 2)).toBeCloseTo(exceptResult.get(2, 2));
    expect(result.get(2, 3)).toBeCloseTo(exceptResult.get(2, 3));
    expect(result.get(3, 0)).toBeCloseTo(exceptResult.get(3, 0));
    expect(result.get(3, 1)).toBeCloseTo(exceptResult.get(3, 1));
    expect(result.get(3, 2)).toBeCloseTo(exceptResult.get(3, 2));
    expect(result.get(3, 3)).toBeCloseTo(exceptResult.get(3, 3));
});

test("Matrix Inverse 2x2", () => {
    let matrix = MatrixCalculator.identity22();
    matrix.set(0, 0, 1);
    matrix.set(0, 1, 2);
    matrix.set(1, 0, 3);
    matrix.set(1, 1, 4);

    let result = MatrixCalculator.inverse(matrix);

    let exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, -2);
    exceptResult.set(0, 1, 1);
    exceptResult.set(1, 0, 1.5);
    exceptResult.set(1, 1, -0.5);

    expect(result).toEqual(exceptResult);
});

test("Matrix Inverse 3x3", () => {
    let matrix = MatrixCalculator.identity33();
    matrix.fillNumber(1);
    matrix.set(0, 2, 2);
    matrix.set(1, 1, 2);
    matrix.set(2, 0, 2);

    let result = MatrixCalculator.inverse(matrix);

    let exceptResult = MatrixCalculator.identity33();
    exceptResult.fillNumber(-0.25);
    exceptResult.set(0, 2, 0.75);
    exceptResult.set(1, 1, 0.75);
    exceptResult.set(2, 0, 0.75);

    expect(result).toEqual(exceptResult);
});


test("Matrix Inverse 4x4", () => {
    let matrix = MatrixCalculator.identity44();
    matrix.fillNumber(1);
    matrix.set(0, 3, -1);
    matrix.set(1, 2, -1);
    matrix.set(2, 1, -1);
    matrix.set(3, 0, -1);

    let result = MatrixCalculator.inverse(matrix);

    let exceptResult = MatrixCalculator.identity44();
    exceptResult.fillNumber(1/4);
    exceptResult.set(0, 3, -1/4);
    exceptResult.set(1, 2, -1/4);
    exceptResult.set(2, 1, -1/4);
    exceptResult.set(3, 0, -1/4);

    expect(result).toEqual(exceptResult);
});

test("Matrix Perspective", () => {
    let result = MatrixCalculator.perspective(90, 16, 9, 1, 100);

    let exceptResult = new Matrix44();
    exceptResult.set(0, 0, 0.5625);
    exceptResult.set(1, 1, 1);
    exceptResult.set(2, 2, -1.0202);
    exceptResult.set(2, 3, -2.0202);
    exceptResult.set(3, 2, -1);

    expect(result.get(0, 0)).toBeCloseTo(exceptResult.get(0, 0));
    expect(result.get(0, 1)).toBeCloseTo(exceptResult.get(0, 1));
    expect(result.get(0, 2)).toBeCloseTo(exceptResult.get(0, 2));
    expect(result.get(0, 3)).toBeCloseTo(exceptResult.get(0, 3));
    expect(result.get(1, 0)).toBeCloseTo(exceptResult.get(1, 0));
    expect(result.get(1, 1)).toBeCloseTo(exceptResult.get(1, 1));
    expect(result.get(1, 2)).toBeCloseTo(exceptResult.get(1, 2));
    expect(result.get(1, 3)).toBeCloseTo(exceptResult.get(1, 3));
    expect(result.get(2, 0)).toBeCloseTo(exceptResult.get(2, 0));
    expect(result.get(2, 1)).toBeCloseTo(exceptResult.get(2, 1));
    expect(result.get(2, 2)).toBeCloseTo(exceptResult.get(2, 2));
    expect(result.get(2, 3)).toBeCloseTo(exceptResult.get(2, 3));
    expect(result.get(3, 0)).toBeCloseTo(exceptResult.get(3, 0));
    expect(result.get(3, 1)).toBeCloseTo(exceptResult.get(3, 1));
    expect(result.get(3, 2)).toBeCloseTo(exceptResult.get(3, 2));
    expect(result.get(3, 3)).toBeCloseTo(exceptResult.get(3, 3));
});

test("Matrix Orthographic", () => {
    let result = MatrixCalculator.orthographic(-2, 2, 2, -2, 1, 10);

    let exceptResult = new Matrix44();
    exceptResult.set(0, 0, 0.5);
    exceptResult.set(1, 1, 0.5);
    exceptResult.set(2, 2, -0.222);
    exceptResult.set(2, 3, -1.222);
    exceptResult.set(3, 3, 1);

    expect(result.get(0, 0)).toBeCloseTo(exceptResult.get(0, 0));
    expect(result.get(0, 1)).toBeCloseTo(exceptResult.get(0, 1));
    expect(result.get(0, 2)).toBeCloseTo(exceptResult.get(0, 2));
    expect(result.get(0, 3)).toBeCloseTo(exceptResult.get(0, 3));
    expect(result.get(1, 0)).toBeCloseTo(exceptResult.get(1, 0));
    expect(result.get(1, 1)).toBeCloseTo(exceptResult.get(1, 1));
    expect(result.get(1, 2)).toBeCloseTo(exceptResult.get(1, 2));
    expect(result.get(1, 3)).toBeCloseTo(exceptResult.get(1, 3));
    expect(result.get(2, 0)).toBeCloseTo(exceptResult.get(2, 0));
    expect(result.get(2, 1)).toBeCloseTo(exceptResult.get(2, 1));
    expect(result.get(2, 2)).toBeCloseTo(exceptResult.get(2, 2));
    expect(result.get(2, 3)).toBeCloseTo(exceptResult.get(2, 3));
    expect(result.get(3, 0)).toBeCloseTo(exceptResult.get(3, 0));
    expect(result.get(3, 1)).toBeCloseTo(exceptResult.get(3, 1));
    expect(result.get(3, 2)).toBeCloseTo(exceptResult.get(3, 2));
    expect(result.get(3, 3)).toBeCloseTo(exceptResult.get(3, 3));
});

test("Matrix LookAt", () => {
    const eyePos = new Vector3(1, 0, 0);
    const targetPos = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    let result = MatrixCalculator.lookAt(eyePos, targetPos, up);

    let exceptResult = new Matrix44();
    exceptResult.set(0, 2, -1);
    exceptResult.set(1, 1, 1);
    exceptResult.set(2, 0, 1);
    exceptResult.set(2, 3, -1);
    exceptResult.set(3, 3, 1);

    expect(result.get(0, 0)).toBeCloseTo(exceptResult.get(0, 0));
    expect(result.get(0, 1)).toBeCloseTo(exceptResult.get(0, 1));
    expect(result.get(0, 2)).toBeCloseTo(exceptResult.get(0, 2));
    expect(result.get(0, 3)).toBeCloseTo(exceptResult.get(0, 3));
    expect(result.get(1, 0)).toBeCloseTo(exceptResult.get(1, 0));
    expect(result.get(1, 1)).toBeCloseTo(exceptResult.get(1, 1));
    expect(result.get(1, 2)).toBeCloseTo(exceptResult.get(1, 2));
    expect(result.get(1, 3)).toBeCloseTo(exceptResult.get(1, 3));
    expect(result.get(2, 0)).toBeCloseTo(exceptResult.get(2, 0));
    expect(result.get(2, 1)).toBeCloseTo(exceptResult.get(2, 1));
    expect(result.get(2, 2)).toBeCloseTo(exceptResult.get(2, 2));
    expect(result.get(2, 3)).toBeCloseTo(exceptResult.get(2, 3));
    expect(result.get(3, 0)).toBeCloseTo(exceptResult.get(3, 0));
    expect(result.get(3, 1)).toBeCloseTo(exceptResult.get(3, 1));
    expect(result.get(3, 2)).toBeCloseTo(exceptResult.get(3, 2));
    expect(result.get(3, 3)).toBeCloseTo(exceptResult.get(3, 3));
});
