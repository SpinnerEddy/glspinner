export type RecordType = 'Frame' | 'SequencialFrames' | 'StartAndStop';
export type RecordOptions = {
    type: RecordType;
    fps: number;
    fixedFrameInterval: number;
    resolution: [number, number];
    saveName: string;
    frameNum?: number;
};
export declare class Recorder {
    private canvas;
    private options;
    private frames;
    private currentFrameCount;
    constructor(canvas: HTMLCanvasElement);
    resetRecord(): void;
    setOptions(options: RecordOptions): void;
    saveSequentialFrames(): Promise<void>;
    endRecordingAuto(): boolean;
    saveFramesAsZip(zipName?: string): Promise<void>;
    private save;
}
