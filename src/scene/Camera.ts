import { Matrix44 } from "../math/matrix/Matrix44";
import { MatrixCalculator } from "../math/MatrixCalculator";
import { Quaternion } from "../math/quaternion/Quaternion";
import { QuaternionCalculator } from "../math/QuaternionCalculator";
import { Vector3 } from "../math/vector/Vector3";

type CameraOptions = {
    position?: Vector3;
    rotation?: Quaternion;
    near?: number;
    far?: number;
    fov?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

type CameraDirection = {
    up?: Vector3;
    forward?: Vector3; 
}

export class Camera {
    private viewMatrix: Matrix44 = MatrixCalculator.identity44();
    private projectionMatrix: Matrix44 = MatrixCalculator.identity44();

    private position: Vector3 = new Vector3(0, 0, 0);
    private rotation: Quaternion = new Quaternion(0, 0, 0, 0);
    private near: number = 1;
    private far: number = 1;
    private fov: number = 1;
    private viewportWidth: number = 1;
    private viewportHeight: number = 1;

    private up: Vector3;
    private forward: Vector3;

    constructor(options: CameraOptions = {}, direction: CameraDirection = {}){
        this.position = options.position ?? new Vector3(0.0, 0.0, -3.0);
        this.rotation = options.rotation ?? new Quaternion(0.0, 0.0, 0.0, 1.0);
        this.near = options.near ?? 0.1;
        this.far = options.far ?? 100;
        this.fov = options.fov ?? 45;
        this.viewportWidth = options.viewportWidth ?? 800;
        this.viewportHeight = options.viewportHeight ?? 800;

        this.up = direction.up ?? new Vector3(0.0, 1.0, 0.0);
        this.forward = direction.forward ?? new Vector3(0.0, 0.0, 1.0);

        this.calculatePerspectiveMatrix();
        this.calculateViewMatrix();
    }

    public setPosition(position: Vector3){
        this.position = position;
        this.calculateViewMatrix();
    }

    public setRotation(rotation: Quaternion){
        this.rotation = rotation;
        this.calculateViewMatrix();
    }

    public setViewport(width: number, height: number){
        if(height == 0){
            throw new Error("Height is zero.");
        }

        this.viewportWidth = width;
        this.viewportHeight = height;
        this.calculatePerspectiveMatrix();
    }

    public getViewMatrix(): Matrix44 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): Matrix44 {
        return this.projectionMatrix;
    }

    private calculateViewMatrix(){
        const calcUp = QuaternionCalculator.rotateVector(this.rotation, this.up);
        const calcForward = QuaternionCalculator.rotateVector(this.rotation, this.forward);

        this.viewMatrix = MatrixCalculator.lookAt(this.position, this.position.add(calcForward), calcUp);
    }

    private calculatePerspectiveMatrix(){
        this.projectionMatrix = MatrixCalculator.perspective(
            this.fov, 
            this.viewportWidth, 
            this.viewportHeight, 
            this.near, 
            this.far);
    }
}