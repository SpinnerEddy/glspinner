import { Vector2 } from "../../math/vector/Vector2";
import { VectorCalculator } from "../../math/VectorCalculator";
import { KeyboardCodeType, MouseButtonType } from "../InputConstants";
import { BaseDevice } from "./BaseDevice";

export class MouseDevice extends BaseDevice {

    private position: Vector2;
    private prevPosition: Vector2;

    constructor() {
        super();

        this.position = new Vector2(0, 0);
        this.prevPosition = new Vector2(0, 0);

        window.addEventListener('mousedown', (event) => {
            this.currentInput[event.button] = true;
        });
        window.addEventListener('mouseup', (event) => {
            this.currentInput[event.button] = false;
        });

        window.addEventListener('mousemove', (event) => {
            this.position.x = event.clientX;
            this.position.y = event.clientY;
        });
    }

    update(): void {
        this.prevInput = { ...this.currentInput };
        
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;
    }

    isDown(type: MouseButtonType | KeyboardCodeType): boolean {
        return this.currentInput[type] ?? false;
    }

    isPressed(type: MouseButtonType | KeyboardCodeType): boolean {
        const prev = this.prevInput[type] ?? false;
        const current = this.currentInput[type] ?? false;

        return !prev && current;
    }

    isReleased(type: MouseButtonType | KeyboardCodeType): boolean {
        const prev = this.prevInput[type] ?? false;
        const current = this.currentInput[type] ?? false;

        return prev && !current;
    }

    getPosition(): Vector2 {
        return this.position;
    }

    getDelta(): Vector2 {
        const delta = VectorCalculator.sub(this.prevPosition, this.position);
        return delta;
    }
}