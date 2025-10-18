import { AudioInputOperation } from "./AudioInputOperation";
export declare class ExternalFileAudioInput implements AudioInputOperation {
    private audioBuffer;
    constructor();
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}
