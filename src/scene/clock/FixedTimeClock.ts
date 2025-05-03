import { Clock } from "./Clock";

export class FixedTimeClock extends Clock{
    constructor(){
        super();
    }

    public update(): void {
        this.frameCount++;

        if(this.frameCount % Math.floor(60 / this.fps) == 0){
            this.elapsedTime += this.frameInterval;
        }
    }

    public shouldDraw(): boolean {
        if(this.frameCount == 0) return true;

        if(this.frameCount % Math.floor(60 / this.fps) == 0){
            return true;
        }

        return false;
    }

    public reset(): void {
        super.reset();
    }
}