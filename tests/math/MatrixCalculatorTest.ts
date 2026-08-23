import { QuaternionCalculator } from '../../src/math/QuaternionCalculator';
import { Matrix44 } from '../../src/math/matrix/Matrix44';
import { MatrixCalculator } from '../../src/math/MatrixCalculator';
import { Vector2 } from '../../src/math/vector/Vector2';
import { Vector3 } from '../../src/math/vector/Vector3';
import { DefaultVectorConstants } from '../../src/math/vector/VectorConstants';
import { MathUtility } from '../../src/math/MathUtility';

test('Matrix Add', () => {
    const matrixA = MatrixCalculator.identity22();
    const matrixB = MatrixCalculator.identity22();

    matrixA.set(0, 1, 2);
    matrixA.set(1, 0, 3);
    matrixB.set(0, 1, 2);
    matrixB.set(1, 0, 3);

    const result = MatrixCalculator.add(matrixA, matrixB);
    const exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 2);
    exceptResult.set(0, 1, 4);
    exceptResult.set(1, 0, 6);
    exceptResult.set(1, 1, 2);

    expect(result).toEqual(exceptResult);
});

test('Matrix Multiply number', () => {
    const matrixA = MatrixCalculator.identity22();

    const result = MatrixCalculator.multiply(matrixA, 5);
    const exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 0);
    exceptResult.set(1, 0, 0);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});

test('Matrix Multiply Matrix', () => {
    let matrixA = MatrixCalculator.identity22();
    const matrixB = MatrixCalculator.identity22();

    matrixA = MatrixCalculator.multiply(matrixA, 5);
    matrixB.set(0, 1, 3);
    matrixB.set(1, 0, 2);
    const result = MatrixCalculator.multiply(matrixA, matrixB);

    const exceptResult = MatrixCalculator.identity22();
    exceptResult.identity();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 15);
    exceptResult.set(1, 0, 10);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});

test('Matrix Multiply Matrix', () => {
    let matrixA = MatrixCalculator.identity22();
    const matrixB = MatrixCalculator.identity22();

    matrixA = MatrixCalculator.multiply(matrixA, 5);
    matrixB.set(0, 1, 3);
    matrixB.set(1, 0, 2);
    const result = MatrixCalculator.multiply(matrixA, matrixB);

    const exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, 5);
    exceptResult.set(0, 1, 15);
    exceptResult.set(1, 0, 10);
    exceptResult.set(1, 1, 5);

    expect(result).toEqual(exceptResult);
});

test('Vector Translate2D', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 2);
    const translateVector = new Vector2(3, 4);

    const result = MatrixCalculator.translate2D(mat, translateVector);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 4);
    exceptResult.set(1, 3, 6);

    expect(result).toEqual(exceptResult);
});

test('Vector Translate3D 1', () => {
    const mat = MatrixCalculator.identity44();
    const translateVector = new Vector3(1, 2, 3);

    const result = MatrixCalculator.translate3D(mat, translateVector);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 1);
    exceptResult.set(1, 3, 2);
    exceptResult.set(2, 3, 3);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test('Vector Translate3D 2', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 5);
    mat.set(1, 3, -5);
    mat.set(2, 3, 10);
    const translateVector = new Vector3(2, 3, -4);

    const result = MatrixCalculator.translate3D(mat, translateVector);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 7);
    exceptResult.set(1, 3, -2);
    exceptResult.set(2, 3, 6);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test('Vector Translate3D 3', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 5);
    mat.set(1, 3, -5);
    mat.set(2, 3, 10);
    const translateVector = new Vector3(0, 0, 0);

    const result = MatrixCalculator.translate3D(mat, translateVector);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 3, 5);
    exceptResult.set(1, 3, -5);
    exceptResult.set(2, 3, 10);
    exceptResult.set(3, 3, 1);

    expect(result).toEqual(exceptResult);
});

test('Vector rotate2D 1', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    const angle = Math.PI * 0.5;

    const result = MatrixCalculator.rotate2D(mat, angle);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 1, -1);
    exceptResult.set(1, 0, 1);
    exceptResult.set(1, 1, 0);
    exceptResult.set(1, 3, 1);

    expect(result).toEqual(exceptResult);
});

test('Vector rotate2D 2', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    const angle = Math.PI;

    const result = MatrixCalculator.rotate2D(mat, angle);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, -1);
    exceptResult.set(0, 3, -1);
    exceptResult.set(1, 1, -1);

    expect(result).toEqual(exceptResult);
});

test('Vector rotate3D 1', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 1);
    mat.set(1, 3, 0);
    mat.set(2, 3, 0);
    const angle = Math.PI * 0.5;

    const result = MatrixCalculator.rotate3D(mat, angle, DefaultVectorConstants.AXIS2DY);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(0, 0, 0);
    exceptResult.set(0, 2, 1);
    exceptResult.set(2, 0, -1);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, -1);

    expect(result).toEqual(exceptResult);
});

test('Vector rotate3D 2', () => {
    const mat = MatrixCalculator.identity44();
    mat.set(0, 3, 0);
    mat.set(1, 3, 1);
    mat.set(2, 3, 0);
    const angle = Math.PI * 0.5;

    const result = MatrixCalculator.rotate3D(mat, angle, DefaultVectorConstants.AXIS2DX);
    const exceptResult = MatrixCalculator.identity44();
    exceptResult.set(1, 1, 0);
    exceptResult.set(1, 2, -1);
    exceptResult.set(2, 1, 1);
    exceptResult.set(2, 2, 0);
    exceptResult.set(2, 3, 1);

    expect(result).toEqual(exceptResult);
});

test('rotate Quaternion', () => {
    const rotation = QuaternionCalculator.createFromAxisAndRadians(DefaultVectorConstants.AXIS2DY, MathUtility.degreesToRadians(90));
    let result = MatrixCalculator.identity44();
    result = MatrixCalculator.rotateByQuaternion(result, rotation);

    const exceptResult = MatrixCalculator.identity44();
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

test('Calculate Local Matrix', () => {
    const position = new Vector3(10, 0, 0);
    const scale = new Vector3(2, 2, 2);
    const rotation = QuaternionCalculator.createFromAxisAndRadians(DefaultVectorConstants.AXIS2DY, MathUtility.degreesToRadians(90));
    let result = MatrixCalculator.identity44();
    result = MatrixCalculator.scale3D(result, scale.x, scale.y, scale.z);
    result = MatrixCalculator.rotateByQuaternion(result, rotation);
    result = MatrixCalculator.translate3D(result, position);

    const exceptResult = MatrixCalculator.identity44();
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

test('Matrix Inverse 2x2', () => {
    const matrix = MatrixCalculator.identity22();
    matrix.set(0, 0, 1);
    matrix.set(0, 1, 2);
    matrix.set(1, 0, 3);
    matrix.set(1, 1, 4);

    const result = MatrixCalculator.inverse(matrix);

    const exceptResult = MatrixCalculator.identity22();
    exceptResult.set(0, 0, -2);
    exceptResult.set(0, 1, 1);
    exceptResult.set(1, 0, 1.5);
    exceptResult.set(1, 1, -0.5);

    expect(result).toEqual(exceptResult);
});

test('Matrix Inverse 3x3', () => {
    const matrix = MatrixCalculator.identity33();
    matrix.fillNumber(1);
    matrix.set(0, 2, 2);
    matrix.set(1, 1, 2);
    matrix.set(2, 0, 2);

    const result = MatrixCalculator.inverse(matrix);

    const exceptResult = MatrixCalculator.identity33();
    exceptResult.fillNumber(-0.25);
    exceptResult.set(0, 2, 0.75);
    exceptResult.set(1, 1, 0.75);
    exceptResult.set(2, 0, 0.75);

    expect(result).toEqual(exceptResult);
});

test('Matrix Inverse 4x4', () => {
    const matrix = MatrixCalculator.identity44();
    matrix.fillNumber(1);
    matrix.set(0, 3, -1);
    matrix.set(1, 2, -1);
    matrix.set(2, 1, -1);
    matrix.set(3, 0, -1);

    const result = MatrixCalculator.inverse(matrix);

    const exceptResult = MatrixCalculator.identity44();
    exceptResult.fillNumber(1 / 4);
    exceptResult.set(0, 3, -1 / 4);
    exceptResult.set(1, 2, -1 / 4);
    exceptResult.set(2, 1, -1 / 4);
    exceptResult.set(3, 0, -1 / 4);

    expect(result).toEqual(exceptResult);
});

test('Matrix Perspective', () => {
    const result = MatrixCalculator.perspective(90, 16, 9, 1, 100);

    const exceptResult = new Matrix44();
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

test('Matrix Orthographic', () => {
    const result = MatrixCalculator.orthographic(-2, 2, 2, -2, 1, 10);

    const exceptResult = new Matrix44();
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

test('Matrix LookAt', () => {
    const eyePos = new Vector3(1, 0, 0);
    const targetPos = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    const result = MatrixCalculator.lookAt(eyePos, targetPos, up);

    const exceptResult = new Matrix44();
    exceptResult.set(0, 2, 1);
    exceptResult.set(1, 1, 1);
    exceptResult.set(2, 0, -1);
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
