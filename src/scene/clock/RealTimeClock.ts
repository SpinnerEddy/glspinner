import { Clock } from "./Clock";

export class RealTimeClock extends Clock{
    private lastTime: number;

    constructor(){
        super();
        this.lastTime = 0;
    }

    public update(): void {
        const currentTime = performance.now();
        this.elapsedTime = (currentTime - this.startTime) * this.timeScale / 1000;
        this.deltaTime = Math.max((currentTime - this.lastTime) * this.timeScale / 1000, 0);

        this.lastTime = currentTime;
        this.frameCount++;

        if(this.lastDrawCallTime <= -1){
            this.lastDrawCallTime = this.deltaTime;
        }else{
            this.lastDrawCallTime += this.deltaTime;
        }
    }

    public shouldDraw(): boolean {
        if(this.lastDrawCallTime == -1) return true;

        if(this.lastDrawCallTime >= this.frameInterval){
            this.lastDrawCallTime = -1;
            return true;
        }

        return false;
    }

    public reset(): void {
        super.reset();
        this.lastTime = 0;
    }
}