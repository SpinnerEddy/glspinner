export interface TextureOperation {
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
}
