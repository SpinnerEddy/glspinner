import { InputInfoPairs } from "../InputConstants";

export class KeyboardDevice {

    private currentInput: InputInfoPairs;
    private prevInput: InputInfoPairs;

    constructor() {
        this.currentInput = {};
        this.prevInput = {};

        window.addEventListener('keydown', (event) => {
            this.currentInput[event.key] = true;
            console.log("key : " + event.key + " Press");
        });
        window.addEventListener('keyup', (event) => {
            this.currentInput[event.key] = false;
            console.log("key : " + event.key + " Up");
        });
    }

    update(): void {
        this.prevInput = { ...this.currentInput };
    }
}