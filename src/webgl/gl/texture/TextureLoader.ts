import { Texture2D } from "./Texture2D";

export class TextureLoader{
    private gl: WebGL2RenderingContext;
    private textureCache: Map<string, Texture2D> = new Map();
    private textureKeySet: Set<string> = new Set();

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
    }

    public getTexture(key: string): Texture2D {
        if(!this.textureKeySet.has(key)){
            throw new Error(`Common Texture with key ${key} not found`);
        }
        
        return this.textureCache.get(key)!;
    }

    public async loadTextureFromPath(texturePath: string): Promise<void> {
        const texture = new Texture2D(this.gl, texturePath);

        let textureKey = texturePath.split('/').pop()?.split('.').shift() as string;
        this.textureKeySet.add(textureKey);

        this.textureCache.set(textureKey, texture);
        
        console.log("loadTextureFromPath done");
        console.log(this.textureCache);
    }
}