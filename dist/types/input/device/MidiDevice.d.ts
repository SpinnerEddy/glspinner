import { MouseButtonType, KeyboardCodeType } from "../InputConstants";
import { BaseDevice } from "./BaseDevice";
export declare class MidiDevice extends BaseDevice {
    constructor();
    update(): void;
    isDown(_code: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(_code: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(_code: MouseButtonType | KeyboardCodeType): boolean;
}
