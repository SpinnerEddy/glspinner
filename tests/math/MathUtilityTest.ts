import { MathUtility } from "../../src/math/MathUtility";

test("degreeToRadians", () => {
    const degree = 180.0;
    const radians = MathUtility.degreesToRadians(degree);

    expect(radians).toEqual(Math.PI);
});

test("RadiansToDegrees", () => {
    const radians = Math.PI;
    const degrees = MathUtility.radiansToDegrees(radians);

    expect(degrees).toEqual(180);
});

test("RadiansToDegrees2", () => {
    const radians = 3.839724354387525;
    const degrees = MathUtility.radiansToDegrees(radians);

    expect(degrees).toEqual(220);
});

test("clamp", () => {
    const minValue = -40.0;
    const maxValue = 50.0;

    const testValue1 = 30.0;
    const result1 = MathUtility.clamp(testValue1, minValue, maxValue);
    expect(result1).toEqual(30.0);

    const testValue2 = 60.0;
    const result2 = MathUtility.clamp(testValue2, minValue, maxValue);
    expect(result2).toEqual(50.0);

    const testValue3 = -60.0;
    const result3 = MathUtility.clamp(testValue3, minValue, maxValue);
    expect(result3).toEqual(-40.0);
});

test("saturate", () => {
    const testValue1 = 0.3;
    const result1 = MathUtility.saturate(testValue1);
    expect(result1).toEqual(0.3);

    const testValue2 = -3.0;
    const result2 = MathUtility.saturate(testValue2);
    expect(result2).toEqual(0);

    const testValue3 = 3.0;
    const result3 = MathUtility.saturate(testValue3);
    expect(result3).toEqual(1);
});

