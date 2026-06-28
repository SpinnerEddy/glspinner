import { InputInfoPairs, KeyboardCodeType, MouseButtonType } from "../InputConstants";
import { DeviceOperation } from "./DeviceOperation";

export abstract class BaseDevice implements DeviceOperation {
    protected currentInput: InputInfoPairs;
    protected prevInput: InputInfoPairs;

    constructor(){
        this.currentInput = {};
        this.prevInput = {};
    }

    abstract update(): void;
    abstract isDown(code: MouseButtonType | KeyboardCodeType): boolean;
    abstract isPressed(code: MouseButtonType | KeyboardCodeType): boolean;
    abstract isReleased(code: MouseButtonType | KeyboardCodeType): boolean;
}