import { Vector } from "./Vector";
import { Vector3 } from "./Vector3";
export declare const DefaultVectorConstants: {
    AXIS2DX: Vector3;
    AXIS2DY: Vector3;
    AXIS2DZ: Vector3;
};
export declare const VectorClassAndSizePair: Record<number, new (...args: number[]) => Vector<any>>;
