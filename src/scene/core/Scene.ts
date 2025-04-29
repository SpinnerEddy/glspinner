import { Clock } from "../clock/Clock";
import { ClockOperation } from "../clock/ClockOperation";
import { SceneOperation } from "./SceneOperation";

export class Scene implements SceneOperation{
    private clock: ClockOperation;
    private isRunning: boolean;
    private updateFunction: Function;
    private drawFunction: Function;
    private additionalSupportFunctionAsync: Function;

    constructor(){
        this.clock = new Clock();
        this.isRunning = false;
        this.updateFunction = () => {};
        this.drawFunction = () => {};
        this.additionalSupportFunctionAsync = () => {};
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

    public setAdditionalSupport(additionalSupport: Function): void {
        this.additionalSupportFunctionAsync = additionalSupport;
    }

    get Clock(): ClockOperation {
        return this.clock;
    }

    private async run(): Promise<void> {
        if(!this.isRunning) return;

        this.clock.update();

        this.updateObjects();

        this.drawObjects();

        await this.additionalSupport();

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

    private async additionalSupport(): Promise<void>{
        await this.additionalSupportFunctionAsync();
    }
}