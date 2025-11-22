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
    private currentUseFontName: string;

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
        this.currentUseFontName = "";
    }

    public setCurrentUseFontName(fontName: string): void {
        if(!this.sdfFontGlyphCache.has(fontName)){
            throw new Error(`Font with name ${fontName} not found`);
        }

        this.currentUseFontName = fontName;
    }

    public getTextureForCurrentFont(): Texture2D {
        if(this.currentUseFontName === ""){
            throw new Error("Current use font name is not set");
        }

        return this.sdfFontTextureCache.get(this.currentUseFontName)!;
    }

    public getGlyphsFromText(text: string): Array<FontGlyph> {
        if(this.currentUseFontName === ""){
            throw new Error("Current use font name is not set");
        }

        const glyphMap = this.sdfFontGlyphCache.get(this.currentUseFontName)!;
        const glyphs: Array<FontGlyph> = [];
        for(const char of text){
            const glyph = glyphMap.get(char);
            if(glyph){
                glyphs.push(glyph);
            }
        }
        return glyphs;
    }

    public loadTextFontFromPathAndJsonText(textureKey: string, sdfFontTexturePath: string, sdfFontTextureReferenceJsonData: FontGlyphJsonData): void {
        const texture = new Texture2D(this.gl, sdfFontTexturePath);
        this.sdfFontTextureCache.set(textureKey, texture);

        const glyphMap: Map<string, FontGlyph> = new Map();
        for(const glyphData of sdfFontTextureReferenceJsonData.chars){
            const fontGlyph = new FontGlyph(glyphData, texture.getTextureSize().width, texture.getTextureSize().height);
            glyphMap.set(glyphData.char, fontGlyph);
        }
        this.sdfFontGlyphCache.set(textureKey, glyphMap);
    }

    public async loadTextFontFromPath(sdfFontTexturePath: string, sdfFontTextureReferenceJsonPath: string): Promise<void> {
        const texture = new Texture2D(this.gl, sdfFontTexturePath);

        let textureKey = sdfFontTexturePath.split('/').pop()?.split('.').shift() as string;

        this.sdfFontTextureCache.set(textureKey, texture);
        
        const response = await fetch(sdfFontTextureReferenceJsonPath);
        const jsonData: FontGlyphJsonData = JSON.parse(await response.text());

        const glyphMap: Map<string, FontGlyph> = new Map();
        for(const glyphData of jsonData.chars){
            const fontGlyph = new FontGlyph(glyphData, texture.getTextureSize().width, texture.getTextureSize().height);
            glyphMap.set(glyphData.char, fontGlyph);
        }
        this.sdfFontGlyphCache.set(textureKey, glyphMap);
    }
}