import { KeyboardDevice } from "./device/KeyboardDevice";
import { MidiDevice } from "./device/MidiDevice";
import { MouseDevice } from "./device/MouseDevice";

export type InputInfoPairs = Record<string, boolean>;

export const DeviceName =
{
    Mouse: 'Mouse',
    Keyboard: 'Keyboard',
    Midi: 'Midi'
} as const;

export type DeviceType = typeof DeviceName[keyof typeof DeviceName];

export const MouseButton = 
{
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
} as const;

export type MouseButtonType = typeof MouseButton[keyof typeof MouseButton];

export const KeyboardCode = 
{
    // --- Alphabet ---
    A: 'KeyA', 
    B: 'KeyB', 
    C: 'KeyC', 
    D: 'KeyD', 
    E: 'KeyE',
    F: 'KeyF', 
    G: 'KeyG', 
    H: 'KeyH', 
    I: 'KeyI', 
    J: 'KeyJ',
    K: 'KeyK', 
    L: 'KeyL', 
    M: 'KeyM', 
    N: 'KeyN', 
    O: 'KeyO',
    P: 'KeyP', 
    Q: 'KeyQ', 
    R: 'KeyR', 
    S: 'KeyS', 
    T: 'KeyT',
    U: 'KeyU', 
    V: 'KeyV', 
    W: 'KeyW', 
    X: 'KeyX', 
    Y: 'KeyY',
    Z: 'KeyZ',

    // --- Numbers (top row) ---
    0: 'D0', 
    1: 'D1', 
    2: 'D2',
    3: 'D3', 
    4: 'D4', 
    5: 'D5',
    6: 'D6', 
    7: 'D7', 
    8: 'D8',
    9: 'D9',

    // --- Function keys ---
    F1: 'F1', 
    F2: 'F2', 
    F3: 'F3', 
    F4: 'F4',
    F5: 'F5', 
    F6: 'F6', 
    F7: 'F7', 
    F8: 'F8',
    F9: 'F9', 
    F10: 'F10', 
    F11: 'F11',
    F12: 'F12',

    // --- Arrows ---
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',

    SPACE: 'Space',
} as const;

export type KeyboardCodeType = typeof KeyboardCode[keyof typeof KeyboardCode];

export type InputOption = 
{ 
    device: DeviceType; 
    type: MouseButtonType | KeyboardCodeType
};

export type DefaultDevices = {
    [DeviceName.Mouse]: MouseDevice;
    [DeviceName.Keyboard]: KeyboardDevice;
    [DeviceName.Midi]: MidiDevice;
};