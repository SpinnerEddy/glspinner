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

export class FontGlyph {
    private char: string;
    private uv: Float32Array;
    private resolution: [number, number];
    private offset: [number, number];
    private xAdvance: number;

    constructor(data: FontGlyphData, textureWidth: number, textureHeight: number) {
        this.char = data.char;
        this.uv = new Float32Array([
            data.x / textureWidth, 
            data.y / textureHeight,
            (data.x + data.width) / textureWidth, 
            (data.y + data.height) / textureHeight]);
        this.resolution = [data.width, data.height];
        this.offset = [data.xoffset, data.yoffset];
        this.xAdvance = data.xadvance;
    }
}