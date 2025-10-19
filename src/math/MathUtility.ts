import { DefaultValueConstants, TrigonometricConstants } from "./ValueConstants";

export class MathUtility{
    static degreesToRadians(degrees: number): number {
        return TrigonometricConstants.DEG_TO_RAD * degrees;
    }

    static radiansToDegrees(radians: number): number {
        return radians * TrigonometricConstants.RAD_TO_DEG;
    }

    static clamp(inputValue: number, minValue: number, maxValue: number): number {
        return Math.max(Math.min(inputValue, maxValue), minValue);
    }

    static saturate(inputValue: number): number {
        return Math.max(Math.min(inputValue, 1), 0);
    }

    static sin(angle: number): number {
        const value = Math.sin(angle);
        return MathUtility.roundToZero(value);
    }

    static cos(angle: number): number {
        const value = Math.cos(angle);
        return MathUtility.roundToZero(value);
    }

    static tan(angle: number): number {
        const value = Math.tan(angle);
        return MathUtility.roundToZero(value);
    }

    static exp(value: number): number {
        const result = Math.exp(value);
        return MathUtility.roundToZero(result);
    }

    static acos(angle: number): number {
        const value = Math.acos(angle);
        return MathUtility.roundToZero(value);
    }

    static atan2(y: number, x: number): number {
        const value = Math.atan2(y, x);
        return MathUtility.roundToZero(value);
    }

    static calculateGaussianCoefficients(range: number, count: number): Float32Array {
        let gCoefficients: number[] = [];
        let totalRange = range * 2.0;
        let startRange = -range;
        let incrementValue = totalRange / count;
        let totalValue = 0.0;

        for(let i = startRange; i <= range; i += incrementValue){
            let value = MathUtility.exp(-(i * i) / totalRange);
            totalValue += value;
            gCoefficients.push(value);
        }

        for(let i = 0; i < gCoefficients.length; i++){
            gCoefficients[i] /= totalValue;
        }

        return new Float32Array(gCoefficients);
    }
    
    private static roundToZero(inputValue: number) {
        return Math.abs(inputValue) < DefaultValueConstants.EPSILON ? 0 : inputValue;
    }
}