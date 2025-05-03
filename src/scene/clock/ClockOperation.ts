export interface ClockOperation {
    update(): void;
    setTimeScale(timeScale: number): void;
    setFps(fps: number): void;
    setFrameInterval(fps: number): void;
    shouldDraw(): boolean;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    getFrameInterval(): number;
    reset(): void;
}