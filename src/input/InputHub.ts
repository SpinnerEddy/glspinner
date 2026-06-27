import { KeyboardDevice } from "./device/KeyboardDevice";

export class InputHub {

    private keyboardDevice: KeyboardDevice;

    constructor() {
        this.keyboardDevice = new KeyboardDevice();
    }

    update(): void {
        this.keyboardDevice.update();
    }
}