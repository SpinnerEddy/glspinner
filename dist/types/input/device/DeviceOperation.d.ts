import { KeyboardCodeType, MouseButtonType } from "../InputConstants";
export interface DeviceOperation {
    update(): void;
    isDown(type: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(type: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(type: MouseButtonType | KeyboardCodeType): boolean;
}
