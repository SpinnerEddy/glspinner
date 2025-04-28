export interface ClockOperation {
    update(): void;
    setTimeScale(timeScale: number): void;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    reset(): void;
}