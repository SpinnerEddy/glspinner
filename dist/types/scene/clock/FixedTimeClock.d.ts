import { Clock } from "./Clock";
export declare class FixedTimeClock extends Clock {
    constructor();
    update(): void;
    shouldDraw(): boolean;
    reset(): void;
}
