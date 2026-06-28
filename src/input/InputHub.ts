import { Vector2 } from "../math/vector/Vector2";
import { DeviceOperation } from "./device/DeviceOperation";
import { KeyboardDevice } from "./device/KeyboardDevice";
import { MouseDevice } from "./device/MouseDevice";
import { DefaultDevices, DeviceName, DeviceType, InputOption } from "./InputConstants";

export class InputHub<TDevices extends Record<string, DeviceOperation> = Record<string, DeviceOperation>> {

    private devices: TDevices;

    constructor() { 
        this.devices = {
            [DeviceName.Mouse]: new MouseDevice(),
            [DeviceName.Keyboard]: new KeyboardDevice()
        } as DefaultDevices & TDevices;
    }

    update(): void {
       for (const device of Object.values(this.devices)) {
            device.update();
        }
    }

    isDown(option: InputOption): boolean {
        const device = this.resolveDevice(option.device);
        if (device == undefined) return false;

        return device.isDown(option.type);
    }

    isPressed(option: InputOption): boolean {
        const device = this.resolveDevice(option.device);
        if (device == undefined) return false;

        return device.isPressed(option.type);
    }

    isReleased(option: InputOption): boolean {
        const device = this.resolveDevice(option.device);
        if (device == undefined) return false;

        return device.isReleased(option.type);
    }

    getMousePosition(): Vector2 {
        const mouse = this.devices[DeviceName.Mouse] as MouseDevice;
        return mouse.getPosition();
    }

    getMouseDelta(): Vector2 {
        const mouse = this.devices[DeviceName.Mouse] as MouseDevice;
        return mouse.getDelta();
    }

    private resolveDevice(deviceType: DeviceType): DeviceOperation | undefined {
        return this.devices[deviceType] ?? undefined;
    }
}