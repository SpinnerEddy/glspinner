export interface FontGlyphData {
    id: number;
    index: number;
    char: string;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    chnl: number;
    x: number;
    y: number;
    page: number;
}
export declare class FontGlyph {
    private char;
    private uv;
    private resolution;
    private offset;
    private xAdvance;
    constructor(data: FontGlyphData, textureWidth: number, textureHeight: number);
    getChar(): string;
    getUv(): {
        u0: number;
        v0: number;
        u1: number;
        v1: number;
    };
    getResolution(): [number, number];
    getOffset(): [number, number];
    getXAdvance(): number;
}
