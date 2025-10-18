import { ClockOperation } from "../clock/ClockOperation";
import { SceneOperation } from "./SceneOperation";
export declare class Scene implements SceneOperation {
    private clock;
    private isRunning;
    private updateFunction;
    private drawFunction;
    private additionalSupportFunctionAsync;
    private animationId;
    constructor();
    start(): void;
    stop(): void;
    reset(): void;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
    get Clock(): ClockOperation;
    private run;
    private updateObjects;
    private drawObjects;
    private additionalSupport;
}
