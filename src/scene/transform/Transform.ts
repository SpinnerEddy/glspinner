import { Matrix44 } from "../../math/matrix/Matrix44";
import { MatrixCalculator } from "../../math/MatrixCalculator";
import { Quaternion } from "../../math/quaternion/Quaternion";
import { QuaternionCalculator } from "../../math/QuaternionCalculator";
import { Vector3 } from "../../math/vector/Vector3";

export class Transform{
    private position: Vector3;
    private scale: Vector3;
    private rotation: Quaternion;

    private localMatrix: Matrix44;
    private worldMatrix: Matrix44;
    private isRequiredRecalculation: boolean;

    constructor(){
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = QuaternionCalculator.identity();

        this.localMatrix = MatrixCalculator.identity44();
        this.worldMatrix = MatrixCalculator.identity44();

        this.isRequiredRecalculation = false;
    }

    public updateMatrix(parentMatrix: Matrix44 | undefined = undefined): void {
        if(!this.isRequiredRecalculation) return;

        this.calculateLocalMatrix();
        this.calculateWorldMatrix(parentMatrix);

        this.isRequiredRecalculation = false;
    }

    public getWorldMatrix(): Matrix44 {
        return this.worldMatrix;
    }

    public setPosition(position: Vector3): void {
        this.position = position;
        this.isRequiredRecalculation = true;
    }

    public setScale(scale: Vector3): void {
        this.scale = scale;
        this.isRequiredRecalculation = true;
    }

    public setRotation(rotation: Quaternion): void {
        this.rotation = rotation;
        this.isRequiredRecalculation = true;
    }

    private calculateLocalMatrix(): void {
        this.localMatrix = MatrixCalculator.identity44();
        this.localMatrix = MatrixCalculator.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z);
        this.localMatrix = MatrixCalculator.rotateByQuaternion(this.localMatrix, this.rotation);
        this.localMatrix = MatrixCalculator.translate3D(this.localMatrix, this.position);
    }

    private calculateWorldMatrix(parentMatrix: Matrix44 | undefined): void {
        if(parentMatrix === undefined){
            this.worldMatrix = this.localMatrix;
        }
        else{
            this.worldMatrix = MatrixCalculator.multiply(parentMatrix, this.localMatrix);
        }
    }
}