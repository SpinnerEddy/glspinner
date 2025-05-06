import { MathUtility } from "../MathUtility";
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

        result.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2));
        result.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w);
        result.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w);
        result.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w);
        result.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2));
        result.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w);
        result.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w);
        result.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w);
        result.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2));

        return result;
    }

    toEuler(): {pitch: number, yaw: number, roll: number}{
        const matrix = this.toMatrix();
        const pitch = Math.atan2(matrix.get(0, 2), matrix.get(2, 2));
        const yaw = Math.asin(-matrix.get(2, 0));
        const roll = Math.atan2(matrix.get(2, 1), matrix.get(2, 2));

        return {pitch, yaw, roll};
    }
}