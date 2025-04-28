import { Clock } from "./clock/Clock";
import { ClockOperation } from "./clock/ClockOperation";

export class Scene {
    private clock: ClockOperation;
    private isRunning: boolean;

    constructor(){
        this.clock = new Clock();
        this.isRunning = false;
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
        // 計算など
    }

    private drawObjects(): void {
        // 描画など
    }
}