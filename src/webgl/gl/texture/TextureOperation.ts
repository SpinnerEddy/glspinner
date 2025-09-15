export interface TextureOperation {
    bind(index: number): void;
    unbind(): void;
}