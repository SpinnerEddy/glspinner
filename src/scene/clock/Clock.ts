import { ClockOperation } from "./ClockOperation";

export class Clock implements ClockOperation{
    private startTime: number;
    private elapsedTime: number;
    private timeScale: number;
    private frameCount: number;
    private deltaTime: number;
    private lastTime: number;

    constructor(){
        this.startTime = performance.now();
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
    }

    public update(): void {
        const currentTime = performance.now();
        this.elapsedTime = (currentTime - this.startTime) * this.timeScale / 1000;
        this.deltaTime = Math.max((currentTime - this.lastTime) * this.timeScale / 1000, 0);

        this.lastTime = currentTime;
        this.frameCount++;
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

    public reset(): void {
        this.startTime = performance.now();
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
    }
}