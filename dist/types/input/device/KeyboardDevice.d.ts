import { KeyboardCodeType, MouseButtonType } from "../InputConstants";
import { BaseDevice } from "./BaseDevice";
export declare class KeyboardDevice extends BaseDevice {
    constructor();
    update(): void;
    isDown(type: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(type: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(type: MouseButtonType | KeyboardCodeType): boolean;
}
