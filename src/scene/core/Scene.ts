import { ClockOperation } from "../clock/ClockOperation";
import { FixedTimeClock } from "../clock/FixedTimeClock";
import { RealTimeClock } from "../clock/RealTimeClock";
import { SceneOperation } from "./SceneOperation";

export class Scene implements SceneOperation{
    private clock: ClockOperation;
    private isRunning: boolean;
    private updateFunction: Function;
    private drawFunction: Function;
    private additionalSupportFunctionAsync: Function;
    private animationId: number;

    constructor(){
        this.clock = new RealTimeClock();
        this.clock.reset();
        this.clock.setFps(60);
        this.isRunning = false;
        this.updateFunction = () => {};
        this.drawFunction = () => {};
        this.additionalSupportFunctionAsync = () => {};
        this.animationId = 0;
    }

    public start(): void {
        if(this.isRunning) return;

        this.isRunning = true;
        this.clock.reset();
        this.run();
    }

    public stop(): void {
        if(!this.isRunning) return;

        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
    }

    public reset(): void {
        this.clock.reset();
    }

    public setUpdate(updateFunction: Function): void {
        this.updateFunction = updateFunction;
    }

    public setDraw(drawFunction: Function): void {
        this.drawFunction = drawFunction;
    }

    public setAdditionalSupport(additionalSupport: Function): void {
        this.additionalSupportFunctionAsync = additionalSupport;
    }

    public setRealTimeClock(fps: number): void {
        this.clock = new RealTimeClock();
        this.clock.reset();
        this.clock.setFps(fps);
    }

    public setFixedTimeClock(fps: number, frameInterval: number): void {
        this.clock = new FixedTimeClock();
        this.clock.reset();
        this.clock.setFps(fps);
        this.clock.setFrameInterval(frameInterval);
    }

    get Clock(): ClockOperation {
        return this.clock;
    }

    private async run(): Promise<void> {
        if(!this.isRunning) return;

        this.clock.update();

        if(this.clock.shouldDraw()){
            this.updateObjects();

            this.drawObjects();

            await this.additionalSupport();
        }

        this.animationId = requestAnimationFrame(() => {
            this.run();
        });

    }

    private updateObjects(): void {
        this.updateFunction();
    }

    private drawObjects(): void {
        this.drawFunction();
    }

    private async additionalSupport(): Promise<void>{
        await this.additionalSupportFunctionAsync();
    }
}