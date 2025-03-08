import { QuaternionCalculator } from "../../src/math/QuaternionCalculator";
import { Vector3 } from "../../src/math/vector/Vector3";

test("Quaternion Add", () => {
    const a = QuaternionCalculator.create(1, 2, 3, 4);
    const b = QuaternionCalculator.create(4, 3, 2, 1);

    const result = QuaternionCalculator.add(a, b);
    const except = QuaternionCalculator.create(5, 5, 5, 5);
    expect(result).toEqual(except);
});

test("Quaternion Sub", () => {
    const a = QuaternionCalculator.create(5, 4, 3, 2);
    const b = QuaternionCalculator.create(4, 3, 2, 1);

    const result = QuaternionCalculator.sub(a, b);
    const except = QuaternionCalculator.create(1, 1, 1, 1);
    expect(result).toEqual(except);
});

test("Quaternion Multiply", () => {
    const q1 = QuaternionCalculator.createFromEuler(Math.PI / 6, Math.PI / 4, Math.PI / 3);
    const q2 = QuaternionCalculator.createFromEuler(-Math.PI / 6, -Math.PI / 4, -Math.PI / 3);

    const result = QuaternionCalculator.multiply(q1, q2);
    const except = QuaternionCalculator.create(0.2134, -0.4170, -0.0089, 0.8835);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});

test("Quaternion Scale", () => {
    const q = QuaternionCalculator.create(5, 4, 3, 2);

    const result = QuaternionCalculator.scale(q, 4);
    const except = QuaternionCalculator.create(20, 16, 12, 8);
    expect(result).toEqual(except);
});

test("Quaternion CreateFromAxisAndRadians", () => {
    const result = QuaternionCalculator.createFromAxisAndRadians(new Vector3(1, 1, 1), Math.PI / 3);

    const except = QuaternionCalculator.create(0.2887, 0.2887, 0.2887, 0.866);
    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});

test("Quaternion Dot", () => {
    const q1 = QuaternionCalculator.create(2, 2, 3, 4);
    const q2 = QuaternionCalculator.create(1, 4, 3, 2);
    const result = QuaternionCalculator.dot(q1, q2);

    const except = 27;
    expect(result).toEqual(except);
});

test("Quaternion Conjugate", () => {
    const q = QuaternionCalculator.create(2, -2, -3, 4);
    const result = QuaternionCalculator.conjugate(q);

    const except = QuaternionCalculator.create(-2, 2, 3, 4);
    expect(result).toEqual(except);
});

test("Quaternion Normalize", () => {
    const q = QuaternionCalculator.create(3, -3, -3, 3);
    const result = QuaternionCalculator.normalize(q);

    const except = QuaternionCalculator.create(0.5, -0.5, -0.5, 0.5);
    expect(result).toEqual(except);
});

test("Quaternion Inverse", () => {
    const q = QuaternionCalculator.create(4, 2, -2, 1);
    const result = QuaternionCalculator.inverse(q);

    const except = QuaternionCalculator.create(-0.16, -0.08, 0.08, 0.04);
    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});

test("Quaternion RotateVector1", () => {
    const q = QuaternionCalculator.createFromAxisAndRadians(new Vector3(0, 1, 0), Math.PI * 0.5);
    const v = new Vector3(1, 0, 0);
    const result = QuaternionCalculator.rotateVector(q, v);
    const except = new Vector3(0, 0, -1);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
});

test("Quaternion RotateVector2", () => {
    const q = QuaternionCalculator.createFromAxisAndRadians(new Vector3(1, 1, 1), Math.PI / 3);
    const v = new Vector3(1, 0, 0);
    const result = QuaternionCalculator.rotateVector(q, v);
    const except = new Vector3(0.6667, 0.6667, -0.3333);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
});


test("Quaternion Slerp1", () => {
    const q1 = QuaternionCalculator.create(0, 1, 0, 0);
    const q2 = QuaternionCalculator.create(1, 0, 0, 0);
    const t = 0;
    const result = QuaternionCalculator.slerp(q1, q2, t);
    const except = QuaternionCalculator.create(0, 1, 0, 0);

    expect(result).toEqual(except);
});

test("Quaternion Slerp2", () => {
    const q1 = QuaternionCalculator.create(0, 1, 0, 0);
    const q2 = QuaternionCalculator.create(1, 0, 0, 0);
    const t = 1;
    const result = QuaternionCalculator.slerp(q1, q2, t);
    const except = QuaternionCalculator.create(1, 0, 0, 0);

    expect(result).toEqual(except);
});

test("Quaternion Slerp3", () => {
    const q1 = QuaternionCalculator.create(0, 0, 1, 0);
    const q2 = QuaternionCalculator.create(1, 1, 0, 1);
    const t = 0.5;
    const result = QuaternionCalculator.slerp(q1, q2, t);
    const except = QuaternionCalculator.create(0.7071, 0.7071, 0.7071, 0.7071);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});

test("Quaternion Slerp4", () => {
    const q1 = QuaternionCalculator.normalize(QuaternionCalculator.create(0, 1, 0, 1));
    const q2 = QuaternionCalculator.normalize(QuaternionCalculator.create(0, -1, 0, -1));
    const t = 0.5;
    const result = QuaternionCalculator.slerp(q1, q2, t);
    const except = QuaternionCalculator.create(0, 0.7071, 0, 0.7071);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});

test("Quaternion Slerp5", () => {
    const q1 = QuaternionCalculator.normalize(QuaternionCalculator.create(0, 0, 0, 1));
    const q2 = QuaternionCalculator.normalize(QuaternionCalculator.create(0.0002, 0, 0, 1));
    const t = 0.5;
    const result = QuaternionCalculator.slerp(q1, q2, t);
    const except = QuaternionCalculator.create(0, 0, 0, 1);

    expect(result.x).toBeCloseTo(except.x);
    expect(result.y).toBeCloseTo(except.y);
    expect(result.z).toBeCloseTo(except.z);
    expect(result.w).toBeCloseTo(except.w);
});