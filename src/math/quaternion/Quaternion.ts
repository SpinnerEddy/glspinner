import { Matrix44 } from "../matrix/Matrix44";
import { QuaternionCalculator } from "../QuaternionCalculator";
import { DefaultVectorConstants } from "../vector/VectorConstants";

export class Quaternion{
    private components: Float32Array;

    constructor(x: number, y: number, z: number, w: number){
        this.components = new Float32Array([x, y, z, w]);
    }

    get x(){
        return this.components[0];
    }

    get y(){
        return this.components[1];
    }

    get z(){
        return this.components[2];
    }

    get w(){
        return this.components[3];
    }

    toMatrix(): Matrix44{
        const matrix = new Matrix44();
        let result = matrix.identity();

        const x = QuaternionCalculator.rotateVector(this, DefaultVectorConstants.AXIS2DX);
        const y = QuaternionCalculator.rotateVector(this, DefaultVectorConstants.AXIS2DY);
        const z = QuaternionCalculator.rotateVector(this, DefaultVectorConstants.AXIS2DZ);
        result.set(0, 0, x.x);
        result.set(0, 1, x.y);
        result.set(0, 2, x.z);
        result.set(0, 0, y.x);
        result.set(0, 1, y.y);
        result.set(0, 2, y.z);
        result.set(0, 0, z.x);
        result.set(0, 1, z.y);
        result.set(0, 2, z.z);

        return matrix;
    }

    toEuler(): {pitch: number, yaw: number, roll: number}{
        const matrix = this.toMatrix();
        const pitch = Math.atan2(matrix.get(0, 2), matrix.get(2, 2));
        const yaw = Math.asin(-matrix.get(2, 0));
        const roll = Math.atan2(matrix.get(2, 1), matrix.get(2, 2));

        return {pitch, yaw, roll};
    }
}