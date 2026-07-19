import { Vector2 } from "../math/vector/Vector2";
import { DeviceOperation } from "./device/DeviceOperation";
import { InputOption } from "./InputConstants";
export declare class InputHub<TDevices extends Record<string, DeviceOperation> = Record<string, DeviceOperation>> {
    private devices;
    constructor();
    update(): void;
    isDown(option: InputOption): boolean;
    isPressed(option: InputOption): boolean;
    isReleased(option: InputOption): boolean;
    getMousePosition(): Vector2;
    getMouseDelta(): Vector2;
    private resolveDevice;
}
