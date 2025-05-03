import { Scene } from "../scene/core/Scene";
import { ClockType, RecordGuiController } from "../tools/gui/RecordGuiController";
import { Recorder } from "../tools/Recorder";
import { BaseApplication } from "./BaseApplication";

export abstract class RecordingApplication extends BaseApplication{
    protected recorder: Recorder;
    private isRecording: boolean;

    constructor(scene: Scene){
        super(scene);
        this.recorder = new Recorder(this.canvas);
        this.isRecording = false;
        RecordGuiController.initialize(
            this.startRecording.bind(this), 
            this.endRecording.bind(this),
            this.changeSceneClock.bind(this)
        );
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this));
        this.scene.setAdditionalSupport(this.additionalSupport.bind(this));
        this.scene.start();
    }

    startRecording(): void {
        if(this.isRecording) return;

        this.recorder.resetRecord();
        this.recorder.setOptions(RecordGuiController.recordOptions);

        this.isRecording = true;
    }

    endRecording(): void {
        if(!this.isRecording) return;
        this.isRecording = false;
        
        if(RecordGuiController.recordOptions.type == 'Frame') return;

        this.recorder.saveFramesAsZip();
    }
    
    changeSceneClock(clockType: ClockType): void {
        const options = RecordGuiController.recordOptions;
        if(clockType == 'RealTime'){
            this.scene.setRealTimeClock(options.fps);
        }
        else{
            this.scene.setFixedTimeClock(options.fps, options.fixedFrameInterval);
        }
    }

    async preload(): Promise<void> {
        await super.preload();
    }

    async additionalSupport(): Promise<void> {
        if(this.isRecording){
            await this.recorder.saveSequentialFrames();

            if(this.recorder.endRecordingAuto()){
                this.endRecording();
            }
        }
    } 

    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}