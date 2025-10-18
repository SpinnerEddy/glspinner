import { TextureOperation } from "./TextureOperation";
export declare class TextureFrameBuffer implements TextureOperation {
    private gl;
    private texture;
    constructor(gl: WebGL2RenderingContext, texture: WebGLTexture);
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
}
