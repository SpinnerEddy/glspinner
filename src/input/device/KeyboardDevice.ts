import { KeyboardCodeType, MouseButtonType } from "../InputConstants";
import { BaseDevice } from "./BaseDevice";

export class KeyboardDevice extends BaseDevice {

    constructor() {
        super();

        window.addEventListener('keydown', (event) => {
            this.currentInput[event.key] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.currentInput[event.key] = false;
        });
    }

    update(): void {
        this.prevInput = { ...this.currentInput };
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
}