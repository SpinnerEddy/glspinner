import { Clock } from "./Clock";
export declare class RealTimeClock extends Clock {
    private lastTime;
    constructor();
    update(): void;
    shouldDraw(): boolean;
    reset(): void;
}
