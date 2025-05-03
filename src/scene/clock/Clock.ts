import { ClockOperation } from "./ClockOperation";

export abstract class Clock implements ClockOperation{
    protected startTime: number;
    protected elapsedTime: number;
    protected timeScale: number;
    protected frameCount: number;
    protected deltaTime: number;
    protected lastDrawCallTime: number;
    protected fps: number;
    protected frameInterval: number;

    constructor(){
        this.startTime = performance.now();
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.lastDrawCallTime = -1;
        this.fps = 60;
        this.frameInterval = 1 / this.fps;
    }

    public setFps(fps: number): void {
        this.fps = fps;
        this.frameInterval = 1 / this.fps;
    }

    public setFrameInterval(fps: number): void {
        this.frameInterval = 1 / fps;
    }

    public setTimeScale(timeScale: number) {
        this.timeScale = timeScale;
    }

    public getElapsedTime(): number {
        return this.elapsedTime;
    }

    public getDeltaTime(): number {
        return this.deltaTime;
    }

    public getFrameCount(): number {
        return this.frameCount;
    }

    public getFrameInterval(): number {
        return this.frameInterval;
    }

    public reset(): void {
        this.startTime = performance.now();
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameInterval = 1 / this.fps;
    }

    public abstract update(): void;
    public abstract shouldDraw(): boolean
}