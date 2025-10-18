import { RecordOptions } from "../Recorder";
export type ClockType = 'RealTime' | 'Fixed';
export declare class RecordGuiController {
    private static recordType;
    private static clockType;
    private static fps;
    private static fixedFrameInterval;
    private static frameNum;
    private static width;
    private static height;
    private static saveName;
    private static onRecordStart;
    private static onRecordEnd;
    private static onChangeClockType;
    static initialize(onRecordStart: () => void, onRecordEnd: () => void, onChangeClockType: (clockType: ClockType) => void): void;
    static get recordOptions(): RecordOptions;
    static get clock(): ClockType;
}
