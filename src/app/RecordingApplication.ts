import { Scene } from "../scene/core/Scene";
import { RecordGuiController } from "../tools/gui/RecordGuiController";
import { Recorder } from "../tools/Recorder";
import { BaseApplication } from "./BaseApplication";

export abstract class RecordingApplication extends BaseApplication{
    protected recorder: Recorder;
    private isRecoding: boolean;

    constructor(scene: Scene){
        super(scene);
        this.recorder = new Recorder(this.canvas);
        this.isRecoding = false;
        RecordGuiController.initialize(this.startRecording.bind(this), this.endRecording.bind(this));
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
        if(this.isRecoding) return;

        this.recorder.resetRecord();
        this.recorder.setOptions(RecordGuiController.recordOptions);

        this.isRecoding = true;
    }

    endRecording(): void {
        if(!this.isRecoding) return;
        this.isRecoding = false;
        
        if(RecordGuiController.recordOptions.type == 'Frame') return;

        this.recorder.saveFramesAsZip();
    }

    async preload(): Promise<void> {
        await super.preload();
    }

    async additionalSupport(): Promise<void> {
        if(this.isRecoding){
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