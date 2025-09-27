import { AudioInputOperation } from "./AudioInputOperation";

export class ExternalFileAudioInput implements AudioInputOperation {
    
    private audioBuffer: AudioBuffer | undefined;

    constructor(){

    }

    async load(path: string, audioContext: AudioContext): Promise<void> {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    }

    getBuffer(): AudioBuffer {
        return this.audioBuffer!;
    }

}