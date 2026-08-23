import { ClockOperation } from '../clock/ClockOperation';

export interface SceneOperation {
    start(): void;
    stop(): void;
    reset(): void;
    getClock(): ClockOperation;
    setUpdate(updateFunction: () => void): void;
    setDraw(drawFunction: () => void): void;
    setAdditionalSupport(additionalSupport: () => void | Promise<void>): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
}
