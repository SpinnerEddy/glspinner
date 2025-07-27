import { Matrix44 } from "../../math/matrix/Matrix44";
import { MatrixCalculator } from "../../math/MatrixCalculator";
import { Quaternion } from "../../math/quaternion/Quaternion";
import { QuaternionCalculator } from "../../math/QuaternionCalculator";
import { Vector3 } from "../../math/vector/Vector3";
import { CameraDirection, CameraOptions, CameraType } from "./CameraConstants";

export class Camera {
    private cameraType: number;
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

    constructor(cameraType: number = CameraType.Perspective, options: CameraOptions = {}, direction: CameraDirection = {}){
        this.cameraType = cameraType;
        this.position = options.position ?? new Vector3(0.0, 0.0, 20.0);
        this.rotation = options.rotation ?? new Quaternion(0.0, 0.0, 0.0, 1.0);
        this.near = options.near ?? 0.1;
        this.far = options.far ?? 100;
        this.fov = options.fov ?? 45;
        this.viewportWidth = options.viewportWidth ?? 800;
        this.viewportHeight = options.viewportHeight ?? 800;

        this.up = direction.up ?? new Vector3(0.0, 1.0, 0.0);
        this.forward = direction.forward ?? new Vector3(0.0, 0.0, -1.0);

        this.calculateProjectionMatrix();
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
        this.calculateProjectionMatrix();
    }

    public setCameraType(type: number){
        this.cameraType = type;
        this.calculateProjectionMatrix();
    }

    public getViewMatrix(): Matrix44 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): Matrix44 {
        return this.projectionMatrix;
    }

    public calculateEyeDirection(): Vector3 {
        // console.log(this.rotation);
        // const result = QuaternionCalculator.rotateVector(this.rotation, new Vector3(0.0, 0.0, -1.0));
        // console.log(result);
        return new Vector3(0.0, 0.0, 1.0);
    }

    private calculateViewMatrix(){
        const calcUp = QuaternionCalculator.rotateVector(this.rotation, this.up);
        const calcForward = QuaternionCalculator.rotateVector(this.rotation, this.forward);

        console.log(calcUp);
        console.log(calcForward);
        console.log(this.position);

        const target = this.position.add(calcForward);

        console.log(target);

        this.viewMatrix = MatrixCalculator.lookAt(this.position, target, calcUp);
        console.log(this.viewMatrix);
    }

    private calculateProjectionMatrix(){
        if(this.cameraType == CameraType.Perspective){
            this.calculatePerspectiveMatrix();
        }
        else{
            this.calculateOrthographicMatrix();
        }
    }

    private calculatePerspectiveMatrix(){
        this.projectionMatrix = MatrixCalculator.perspective(
            this.fov, 
            this.viewportWidth, 
            this.viewportHeight, 
            this.near, 
            this.far);
    }

    private calculateOrthographicMatrix(){
        if(this.viewportHeight == 0){
            throw new Error("Height is zero.");
        }

        const aspect = this.viewportWidth / this.viewportHeight;
        const orthoHeight = 1.0
        const orthoWidth = orthoHeight * aspect;

        const left = -orthoWidth;
        const right = orthoWidth;
        const top = orthoHeight;
        const bottom = -orthoHeight;

        this.projectionMatrix = MatrixCalculator.orthographic(
            left,
            right,
            top,
            bottom,
            this.near,
            this.far
        );
    }
}