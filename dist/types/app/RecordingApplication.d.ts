import { Scene } from "../scene/core/Scene";
import { ClockType } from "../tools/gui/RecordGuiController";
import { Recorder } from "../tools/Recorder";
import { BaseApplication } from "./BaseApplication";
export declare abstract class RecordingApplication extends BaseApplication {
    protected recorder: Recorder;
    private isRecording;
    constructor(scene: Scene);
    start(): Promise<void>;
    startRecording(): void;
    endRecording(): void;
    changeSceneClock(clockType: ClockType): void;
    preload(): Promise<void>;
    additionalSupport(): Promise<void>;
    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}
