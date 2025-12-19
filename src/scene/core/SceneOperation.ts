import { ClockOperation } from "../clock/ClockOperation";

export interface SceneOperation{
    start(): void;
    stop(): void;
    reset(): void;
    getClock(): ClockOperation;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
}