import { Texture2D } from "../texture/Texture2D";
import { FontGlyph, FontGlyphData } from "./FontGlyph";
interface FontGlyphJsonData {
    pages: string[];
    chars: FontGlyphData[];
}
export declare class TextFontLoader {
    private gl;
    private sdfFontTextureCache;
    private sdfFontGlyphCache;
    private currentUseFontName;
    constructor(gl: WebGL2RenderingContext);
    setCurrentUseFontName(fontName: string): void;
    getTextureForCurrentFont(): Texture2D;
    getGlyphsFromText(text: string): Array<FontGlyph>;
    loadTextFontFromPathAndJsonText(textureKey: string, sdfFontTexturePath: string, sdfFontTextureReferenceJsonData: FontGlyphJsonData): void;
    loadTextFontFromPath(sdfFontTexturePath: string, sdfFontTextureReferenceJsonPath: string): Promise<void>;
}
export {};
