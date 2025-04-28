import { Clock } from "./clock/Clock";
import { ClockOperation } from "./clock/ClockOperation";

export class Scene {
    private clock: ClockOperation;
    private isRunning: boolean;
    private updateFunction: Function;
    private drawFunction: Function;

    constructor(){
        this.clock = new Clock();
        this.isRunning = false;
        this.updateFunction = () => {};
        this.drawFunction = () => {};
    }

    public start(): void {
        if(this.isRunning) return;

        this.clock.reset();
        this.isRunning = true;
        this.run();
    }

    public stop(): void {
        if(!this.isRunning) return;

        this.isRunning = false;
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

    private run(): void {
        if(!this.isRunning) return;

        this.clock.update();

        this.updateObjects();

        this.drawObjects();

        requestAnimationFrame(() => {
            this.run();
        });
    }

    private updateObjects(): void {
        this.updateFunction();
    }

    private drawObjects(): void {
        this.drawFunction();
    }
}