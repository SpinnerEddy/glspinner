import { Texture2D } from "../texture/Texture2D";
import { FontGlyph, FontGlyphData } from "./FontGlyph";

interface FontGlyphJsonData {
    pages: string[];
    chars: FontGlyphData[];
}

export class TextFontLoader{
    private gl: WebGL2RenderingContext;
    private sdfFontTextureCache: Map<string, Texture2D> = new Map();
    private sdfFontGlyphCache: Map<string, Map<string, FontGlyph>> = new Map();

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
    }

    public async loadTextFontFromPath(sdfFontTexturePath: string, sdfFontTextureReferenceJson: string): Promise<void> {
        const texture = new Texture2D(this.gl, sdfFontTexturePath);

        let textureKey = sdfFontTexturePath.split('/').pop()?.split('.').shift() as string;;

        this.sdfFontTextureCache.set(textureKey, texture);
        
        console.log("loadTextFontTextureFromPath done");
        console.log(this.sdfFontTextureCache);

        const response = await fetch(sdfFontTextureReferenceJson);
        const jsonData: FontGlyphJsonData = JSON.parse(await response.text());

        const glyphMap: Map<string, FontGlyph> = new Map();
        for(const glyphData of jsonData.chars){
            const fontGlyph = new FontGlyph(glyphData, texture.getTextureSize().width, texture.getTextureSize().height);
            glyphMap.set(glyphData.char, fontGlyph);
        }
        this.sdfFontGlyphCache.set(textureKey, glyphMap);

        console.log("loadTextFontDataFromPath done");
        console.log(this.sdfFontGlyphCache);
    }
}