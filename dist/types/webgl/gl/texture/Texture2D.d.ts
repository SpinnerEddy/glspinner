import { TextureOperation } from "./TextureOperation";
export declare class Texture2D implements TextureOperation {
    private gl;
    private texture;
    private image;
    constructor(gl: WebGL2RenderingContext, source: string);
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
    private setUpTexture;
}
