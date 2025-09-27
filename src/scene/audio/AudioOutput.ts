import { AudioInputOperation } from "./AudioInputOperation";

export class AudioOutput {
    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer | undefined;
    private sourceNode: AudioBufferSourceNode | undefined; 

    private isPlaying: boolean = false;
    private pauseTime: number = 0;
    private startTime: number = 0;

    constructor(){
        this.audioContext = new AudioContext();
    }

    public playAudio(offset: number = 0): void {
        if(this.audioBuffer == undefined){
            console.log("Audio not loaded!!");
            return;
        }

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.connect(this.audioContext.destination);

        this.startTime = this.audioContext.currentTime - offset;
        this.sourceNode.start(0, offset);
        this.isPlaying = true;
    }

    public pauseAudio(): void {
        if(this.sourceNode && this.isPlaying){
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode = undefined;

            this.pauseTime = this.audioContext.currentTime - this.startTime;
            this.isPlaying = false;
        }
    }

    public resumeAudio(): void {
        if(this.sourceNode == undefined || this.isPlaying) return;
        
        this.playAudio(this.pauseTime);
    }

    public stopAudio(): void {
        if(this.sourceNode){
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode = undefined;
        }

        this.isPlaying = false;
        this.pauseTime = 0;
    }

    public setInput(audioInput: AudioInputOperation){
        this.audioBuffer = audioInput.getBuffer();
    }

    public getAudioContext(): AudioContext {
        return this.audioContext;
    }
}