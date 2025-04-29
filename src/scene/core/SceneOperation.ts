export interface SceneOperation{
    start(): void;
    stop(): void;
    reset(): void;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
}