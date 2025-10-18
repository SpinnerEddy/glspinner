import { Matrix44 } from "../../math/matrix/Matrix44";
import { Quaternion } from "../../math/quaternion/Quaternion";
import { Vector3 } from "../../math/vector/Vector3";
export declare class Transform {
    private position;
    private scale;
    private rotation;
    private localMatrix;
    private worldMatrix;
    private isRequiredRecalculation;
    constructor();
    updateMatrix(parentMatrix?: Matrix44 | undefined): void;
    getWorldMatrix(): Matrix44;
    setPosition(position: Vector3): void;
    setScale(scale: Vector3): void;
    setRotation(rotation: Quaternion): void;
    getWorldPosition(): Vector3;
    private calculateLocalMatrix;
    private calculateWorldMatrix;
}
