import { Texture2D } from "../texture/Texture2D";
import { FontGlyph } from "./FontGlyph";
export declare class TextFontLoader {
    private gl;
    private sdfFontTextureCache;
    private sdfFontGlyphCache;
    private currentUseFontName;
    constructor(gl: WebGL2RenderingContext);
    setCurrentUseFontName(fontName: string): void;
    getTextureForCurrentFont(): Texture2D;
    getGlyphsFromText(text: string): Array<FontGlyph>;
    loadTextFontFromPath(sdfFontTexturePath: string, sdfFontTextureReferenceJson: string): Promise<void>;
}
