export interface ApplicationOperation{
    start(): Promise<void>;
    preload(): Promise<void>;
    setup(): void;
    update(): void;
    draw(): void;
}