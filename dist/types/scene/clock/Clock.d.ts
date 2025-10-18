import { ClockOperation } from "./ClockOperation";
export declare abstract class Clock implements ClockOperation {
    protected startTime: number;
    protected elapsedTime: number;
    protected timeScale: number;
    protected frameCount: number;
    protected deltaTime: number;
    protected lastDrawCallTime: number;
    protected fps: number;
    protected frameInterval: number;
    constructor();
    setFps(fps: number): void;
    setFrameInterval(fps: number): void;
    setTimeScale(timeScale: number): void;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    getFrameInterval(): number;
    reset(): void;
    abstract update(): void;
    abstract shouldDraw(): boolean;
}
