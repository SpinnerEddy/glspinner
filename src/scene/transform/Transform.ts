import { Matrix44 } from "../../math/matrix/Matrix44";
import { MatrixCalculator } from "../../math/MatrixCalculator";
import { Quaternion } from "../../math/quaternion/Quaternion";
import { QuaternionCalculator } from "../../math/QuaternionCalculator";
import { Vector3 } from "../../math/vector/Vector3";

export class Transform{
    private id: string;
    private position: Vector3;
    private scale: Vector3;
    private rotation: Quaternion;

    private localMatrix: Matrix44;
    private worldMatrix: Matrix44;

    private parent: Transform | undefined;
    private children: Transform[] = [];

    constructor(id: string = "", parent: Transform | undefined = undefined, children: Transform[] = []){
        this.id = id;
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = QuaternionCalculator.identity();

        this.localMatrix = MatrixCalculator.identity44();
        this.worldMatrix = MatrixCalculator.identity44();

        this.parent = parent;
        if(this.parent !== undefined){
            this.parent.addChild(this);
        }

        children.forEach(child => {
            this.addChild(child);
        });
    }

    public outputLog(): void {
        console.log("this : " + this.id);
        console.log("parent : " + this.parent?.id);
        if(this.children.length == 0){
            console.log("No Child");
            console.log("-----------------");
            return;
        }

        this.children.forEach(element => {
            console.log("parent : " + this.id + " child : " + element?.id);
            element.outputLog();
        });
    }

    public addChild(child: Transform): void {
        const index = this.children.indexOf(child);
        if(index !== -1) return;

        if(child.parent !== undefined){
            child.parent.removeChild(child);
        }

        this.children.push(child);
        child.parent = this;
    }

    public removeChild(child: Transform): void {
        const index = this.children.indexOf(child);
        if(index === -1) return;

        child.parent = undefined;
        this.children.splice(index, 1);
    }
}