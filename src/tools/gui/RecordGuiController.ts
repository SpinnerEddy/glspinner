import { RecordOptions, RecordType } from "../Recorder";
import { GuiUtility } from "./GuiUtility";

export type ClockType = 'RealTime' | 'Fixed';

export class RecordGuiController{
    private static recordType: RecordType = 'SequencialFrames'
    private static clockType: ClockType = 'RealTime';
    private static fps: number = 60;
    private static fixedFrameInterval: number = 60;
    private static frameNum: number = 300;
    private static width: number = 800;
    private static height: number = 800;
    private static saveName: string = "test";
    private static onRecordStart: () => void;
    private static onRecordEnd: () => void;
    private static onChangeClockType: (clockType: ClockType) => void;

    static initialize(
        onRecordStart: () => void, 
        onRecordEnd: () => void,
        onChangeClockType: (clockType: ClockType) => void){
        this.onRecordStart = onRecordStart;
        this.onRecordEnd = onRecordEnd;
        this.onChangeClockType = onChangeClockType;

        GuiUtility.initialize();
        GuiUtility.addFolder("Recording");
        GuiUtility.addElement(
            {recordType: 'SequencialFrames'}, 
            "recordType",
            (value: string) => {
                this.recordType = value as RecordType;
            },
            ['Frame', 'SequencialFrames', 'StartAndStop']
        );
        GuiUtility.addElement(
            {clockType: 'RealTime'}, 
            "clockType",
            (value: string) => {
                this.clockType = value as ClockType;
                this.onChangeClockType?.(this.clockType);
            },
            ['RealTime', 'Fixed']
        );
        GuiUtility.addElement(
            {fps: 60}, 
            "fps",
            (value: number) => {
                this.fps = value;
                this.onChangeClockType?.(this.clockType);
            }
        );
        GuiUtility.addElement(
            {fixedFrameInterval: 60}, 
            "fixedFrameInterval",
            (value: number) => {
                this.fixedFrameInterval = value;
                this.onChangeClockType?.(this.clockType);
            }
        );
        GuiUtility.addElement(
            {frameNum: 300}, 
            "frameNum",
            (value: number) => {
                this.frameNum = value;
            }
        );
        GuiUtility.addElement(
            {saveName: "test"}, 
            "saveName",
            (value: string) => {
                this.saveName = value;
            }
        );
        GuiUtility.addFolder("Resolution");
        GuiUtility.addElement(
            {width: 800}, 
            "width",
            (value: number) => {
                this.width = value;
            }
        );
        GuiUtility.addElement(
            {height: 800}, 
            "height",
            (value: number) => {
                this.height = value;
            }
        );
        GuiUtility.resetFolder();
        GuiUtility.addAction(() => {
            this.onRecordStart?.();
        }, 
        "StartRecord");
        GuiUtility.addAction(() => {
            this.onRecordEnd?.();
        }, 
        "StopRecord");
    }

    static get recordOptions(): RecordOptions {
        return {
            type: this.recordType,
            fps: this.fps,
            fixedFrameInterval: this.fixedFrameInterval,
            resolution: [this.width, this.height],
            saveName: this.saveName,
            frameNum: this.frameNum
        };
    }

    static get clock(): ClockType {
        return this.clockType;
    } 
}