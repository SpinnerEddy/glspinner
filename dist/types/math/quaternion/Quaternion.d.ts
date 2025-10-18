import { Matrix44 } from "../matrix/Matrix44";
export declare class Quaternion {
    private components;
    constructor(x: number, y: number, z: number, w: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    toMatrix(): Matrix44;
    toEuler(): {
        pitch: number;
        yaw: number;
        roll: number;
    };
}
