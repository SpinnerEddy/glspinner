import { Texture2D } from "./Texture2D";
export declare class TextureLoader {
    private gl;
    private textureCache;
    private textureKeySet;
    constructor(gl: WebGL2RenderingContext);
    getTexture(key: string): Texture2D;
    loadTextureFromPath(texturePath: string): Promise<void>;
}
