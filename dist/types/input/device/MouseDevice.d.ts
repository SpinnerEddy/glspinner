import { Vector2 } from "../../math/vector/Vector2";
import { KeyboardCodeType, MouseButtonType } from "../InputConstants";
import { BaseDevice } from "./BaseDevice";
export declare class MouseDevice extends BaseDevice {
    private position;
    private prevPosition;
    constructor();
    update(): void;
    isDown(type: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(type: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(type: MouseButtonType | KeyboardCodeType): boolean;
    getPosition(): Vector2;
    getDelta(): Vector2;
}
