import { AudioInputOperation } from "./AudioInputOperation";
export declare class AudioOutput {
    private audioContext;
    private audioBuffer;
    private sourceNode;
    private isPlaying;
    private pauseTime;
    private startTime;
    constructor();
    playAudio(offset?: number): void;
    pauseAudio(): void;
    resumeAudio(): void;
    stopAudio(): void;
    setInput(audioInput: AudioInputOperation): void;
    getAudioContext(): AudioContext;
}
