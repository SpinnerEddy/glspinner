import { Scene } from "../scene/core/Scene";
import { Recorder, RecordOptions } from "../tools/Recorder";
import { BaseApplication } from "./BaseApplication";

export abstract class RecordingApplication extends BaseApplication{
    protected recorder: Recorder;
    protected isRecording: boolean = false;
    protected options: RecordOptions;

    constructor(scene: Scene){
        super(scene);
        this.recorder = new Recorder(this.canvas);
        this.options = {
            type: 'Frame',
            fps: 60,
            resolution: [800, 800],
            saveName: 'test',
            frameNum: 1
        };
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this));
        this.scene.setAdditionalSupport(this.additionalSupport.bind(this));
        this.scene.start();
    }

    protected setRecordingOptions(options: RecordOptions) {
        this.options = options;
    }

    protected startRecording(): void {
        this.recorder.resetRecord();
        this.recorder.setOptions(this.options);
        this.isRecording = true;
    }

    protected endRecording(): void {
        this.isRecording = false;
        if(this.options.type == 'Frame') return;

        this.recorder.saveFramesAsZip();
    }

    async preload(): Promise<void> {
        await this.preload();
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