import { RecordType } from '../Recorder';
type SettingValue = number | string | boolean | RecordType;
type SettingArray = number[] | Float32Array | string[] | boolean[];
type SettingType = SettingValue | SettingArray;
type SettingElement = Record<string, SettingType>;
export declare class GuiUtility {
    private static guiArrays;
    static initialize(): void;
    static addFolder(folderName: string): void;
    static resetFolder(): void;
    static addElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void, options?: T[K][] | Record<string, T[K]>): void;
    static addElementWithRange<T extends SettingElement, K extends keyof T>(params: T, name: K, min: number, max: number, onChangeAction?: (value: T[K]) => void): void;
    static addColorElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void): void;
    static addAction(action: () => void, name: string): void;
    private static get GUI();
}
export {};
