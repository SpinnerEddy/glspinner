export interface AudioInputOperation {
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}
