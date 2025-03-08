import { Vector2 } from "../../src/math/vector/Vector2";
import { Vector3 } from "../../src/math/vector/Vector3";
import { VectorCalculator } from "../../src/math/VectorCalculator";

test("Vector Add", () => {
    const a = new Vector2(3, 4);
    const b = new Vector2(4, 5);

    const result = VectorCalculator.add(a, b);
    const except = new Vector2(7, 9);
    expect(result).toEqual(except);
});

test("Vector Sub", () => {
    const a = new Vector2(3, 4);
    const b = new Vector2(4, 5);

    const result = VectorCalculator.sub(a, b);
    const except = new Vector2(1, 1);
    expect(result).toEqual(except);
});

test("Vector calcDistance", () => {
    const a = new Vector2(3, 4);
    const b = new Vector2(4, 5);

    const result = VectorCalculator.calcDistance(a, b);
    const except = Math.sqrt(2);
    expect(result).toEqual(except);
});

test("Vector dot", () => {
    const a = new Vector2(3, 4);
    const b = new Vector2(4, 5);

    const result = VectorCalculator.dot(a, b);
    const except = 32;
    expect(result).toEqual(except);
});

test("Vector length", () => {
    const a = new Vector2(3, 4);

    const result = VectorCalculator.length(a);
    const except = 5;
    expect(result).toEqual(except);
});

test("Vector normalize", () => {
    const a = new Vector2(3, 4);

    const result = VectorCalculator.normalize(a);
    const except = new Vector2(0.6, 0.8);
    expect(result).toEqual(except);
});

test("Vector multiply", () => {
    const a = new Vector2(3, 4);

    const result = VectorCalculator.multiply(a, 3);
    const except = new Vector2(9, 12);
    expect(result).toEqual(except);
});

test("Vector divide", () => {
    const a = new Vector2(3, 4);

    const result = VectorCalculator.divide(a, 5);
    const except = new Vector2(0.6, 0.8);
    expect(result).toEqual(except);
});

test("Vector SetLength", () => {
    const a = new Vector2(3, 4);

    const result = VectorCalculator.setLength(a, 10);
    const except = new Vector2(6, 8);
    expect(result).toEqual(except);
});

test("Vector calcAngle", () => {
    const a = new Vector2(0, 1);
    const b = new Vector2(1, 0);

    const result = VectorCalculator.calcAngle(a, b);
    const except = Math.PI * 0.5;
    expect(result).toEqual(except);
});

test("Vector cross", () => {
    const a = new Vector3(1, 2, 3);
    const b = new Vector3(3, 4, 5);

    const result = VectorCalculator.cross(a, b);
    const except = new Vector3(-2, 4, -2);
    expect(result).toEqual(except);
});

test("Vector heading2D", () => {
    const a = new Vector2(0, 1);

    const result = VectorCalculator.heading2D(a);
    const except = Math.PI * 0.5;
    expect(result).toEqual(except);
});