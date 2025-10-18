export declare class MathUtility {
    static degreesToRadians(degrees: number): number;
    static radiansToDegrees(radians: number): number;
    static clamp(inputValue: number, minValue: number, maxValue: number): number;
    static saturate(inputValue: number): number;
    static sin(angle: number): number;
    static cos(angle: number): number;
    static tan(angle: number): number;
    static acos(angle: number): number;
    static atan2(y: number, x: number): number;
    private static roundToZero;
}
