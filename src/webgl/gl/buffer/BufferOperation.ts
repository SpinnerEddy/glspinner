export interface BufferOperation {
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
}