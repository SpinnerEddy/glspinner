import { Quaternion } from "../../math/quaternion/Quaternion";
import { Vector3 } from "../../math/vector/Vector3";

export type CameraOptions = {
    position?: Vector3;
    rotation?: Quaternion;
    near?: number;
    far?: number;
    fov?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

export type CameraDirection = {
    up?: Vector3;
    forward?: Vector3; 
}

export const CameraType = {
    Perspective: 0,
    Orthography: 1
}
