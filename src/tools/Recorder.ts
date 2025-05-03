import JSZip from 'jszip';

export type RecordType = 'Frame' | 'SequencialFrames' | 'StartAndStop';

export type RecordOptions = {
    type: RecordType,
    fps: number,
    resolution: [number, number],
    saveName: string,
    frameNum?: number,
}

type FrameData = {
    blob: Blob,
    frameName: string
}

export class Recorder{
    private canvas: HTMLCanvasElement;
    private options: RecordOptions | undefined;
    private frames: FrameData[] = [];
    private currentFrameCount: number;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.currentFrameCount = 0;
    }

    public resetRecord(): void {
        this.frames = [];
        this.currentFrameCount = 0;
    }

    public setOptions(options: RecordOptions): void {
        this.options = options;
    }

    public async saveSequentialFrames(): Promise<void> {
        if(this.options == undefined) return;

        await new Promise<void>((resolve) => {
            this.canvas.toBlob((blob) => {
                if(blob == null){
                    resolve();
                    return;
                }

                if(this.options?.type == 'Frame'){
                    this.save(blob, this.options?.saveName);
                }
                else{
                    this.frames.push({
                        blob: blob,
                        frameName: `${this.options?.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, '0')}.png`
                    })
                }

                this.currentFrameCount++;
                console.log(this.currentFrameCount);
                resolve();
            }, 'image/png');
        });
    }

    public endRecordingAuto(): boolean {
        if(this.options == undefined) {
            return true
        };
        if(this.options.type == 'StartAndStop') return false;

        const saveFrameNum = ((this.options.type == 'Frame') ? 1 : this.options.frameNum) ?? 0;
        const isEnd = this.currentFrameCount >= saveFrameNum;
        return isEnd;
    }

    public async saveFramesAsZip(zipName: string = 'record.zip'): Promise<void> {
        if(this.frames.length == 0) return;

        const zip = new JSZip();
        for(let i = 0; i < this.frames.length; i++){
            const frame = this.frames[i];
            zip.file(frame.frameName, frame.blob);
        }

        const data = await zip.generateAsync({type: 'blob'});
        this.save(data, zipName);
    }

    private save(blob: Blob, frameName: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = frameName;
        a.click();
        URL.revokeObjectURL(url);
    }
}