import { Matrix44 } from '../../math/matrix/Matrix44';
import { MatrixCalculator } from '../../math/MatrixCalculator';
import { Quaternion } from '../../math/quaternion/Quaternion';
import { QuaternionCalculator } from '../../math/QuaternionCalculator';
import { Vector3 } from '../../math/vector/Vector3';
import { VectorCalculator } from '../../math/VectorCalculator';

export class Transform {
    private position: Vector3;
    private scale: Vector3;
    private rotation: Quaternion;

    private localMatrix: Matrix44;
    private worldMatrix: Matrix44;
    private isRequiredRecalculation: boolean;

    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = QuaternionCalculator.identity();

        this.localMatrix = MatrixCalculator.identity44();
        this.worldMatrix = MatrixCalculator.identity44();

        this.isRequiredRecalculation = false;
    }

    updateMatrix(parentMatrix: Matrix44 | undefined = undefined): void {
        if (!this.isRequiredRecalculation) return;

        this.calculateLocalMatrix();
        this.calculateWorldMatrix(parentMatrix);

        this.isRequiredRecalculation = false;
    }

    getWorldMatrix(): Matrix44 {
        return this.worldMatrix;
    }

    setPosition(position: Vector3): void {
        this.position = position;
        this.isRequiredRecalculation = true;
    }

    setScale(scale: Vector3): void {
        this.scale = scale;
        this.isRequiredRecalculation = true;
    }

    setRotation(rotation: Quaternion): void {
        this.rotation = rotation;
        this.isRequiredRecalculation = true;
    }

    getWorldPosition(): Vector3 {
        return new Vector3(this.worldMatrix.get(0, 3), this.worldMatrix.get(1, 3), this.worldMatrix.get(2, 3));
    }

    getRotation(): Quaternion {
        return this.rotation;
    }

    getForwardVector(): Vector3 {
        const forward = new Vector3(0.0, 0.0, -1.0);
        return VectorCalculator.normalize(QuaternionCalculator.rotateVector(this.rotation, forward));
    }

    private calculateLocalMatrix(): void {
        this.localMatrix = MatrixCalculator.identity44();
        this.localMatrix = MatrixCalculator.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z);
        this.localMatrix = MatrixCalculator.rotateByQuaternion(this.localMatrix, this.rotation);
        this.localMatrix = MatrixCalculator.translate3D(this.localMatrix, this.position);
    }

    private calculateWorldMatrix(parentMatrix: Matrix44 | undefined): void {
        if (parentMatrix === undefined) {
            this.worldMatrix = this.localMatrix;
        } else {
            this.worldMatrix = MatrixCalculator.multiply(parentMatrix, this.localMatrix);
        }
    }
}
