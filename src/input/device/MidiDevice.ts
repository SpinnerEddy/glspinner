import { MouseButtonType, KeyboardCodeType } from '../InputConstants';
import { BaseDevice } from './BaseDevice';

export class MidiDevice extends BaseDevice {
    constructor() {
        super();

        window.navigator.requestMIDIAccess().then((midi) => {
            midi.inputs.forEach((input) => {
                input.onmidimessage = (e) => {
                    console.log(e.data);
                };
            });
            midi.outputs.forEach((output) => {
                output.open();
                output.send([224, 0, 127]);
                output.send([225, 0, 127]);
                output.send([226, 0, 127]);
                output.send([227, 0, 127]);
                output.send([228, 0, 127]);
                output.send([229, 0, 127]);
                output.send([230, 0, 127]);
                output.send([231, 0, 127]);
                output.send([176, 10, 127]);
                for (let i = 0; i < 32; i++) {
                    output.send([0x90, i, 127]);
                }
                for (let i = 0; i < 32; i++) {
                    output.send([176, i, 127]);
                }
                output.send([0x90, 91, 127]);
                output.send([0x90, 92, 127]);
                output.send([0x90, 93, 127]);
                output.send([0x90, 94, 127]);
                output.send([0x90, 95, 127]);
                output.send([0x90, 96, 127]);
                output.send([0x90, 97, 127]);
                output.send([0x90, 98, 127]);
                output.send([0x90, 99, 127]);

                output.send([0x90, 46, 127]);
                output.send([0x90, 47, 127]);
                console.log(output);
            });
        });
    }

    update(): void {
        // throw new Error("Method not implemented.");
    }

    isDown(_code: MouseButtonType | KeyboardCodeType): boolean {
        // throw new Error("Method not implemented.");
        return false;
    }

    isPressed(_code: MouseButtonType | KeyboardCodeType): boolean {
        // throw new Error("Method not implemented.");
        return false;
    }

    isReleased(_code: MouseButtonType | KeyboardCodeType): boolean {
        // throw new Error("Method not implemented.");
        return false;
    }
}
