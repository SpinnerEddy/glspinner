import { Vector } from "./Vector";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export const DefaultVectorConstants = 
{
    AXIS2DX: new Vector3(1, 0, 0),
    AXIS2DY: new Vector3(0, 1, 0),
    AXIS2DZ: new Vector3(0, 0, 1),
}

export const VectorClassAndSizePair: Record<number, new (...args: number[]) => Vector<any>> = 
{
    2: Vector2,
    3: Vector3,
    4: Vector4
};