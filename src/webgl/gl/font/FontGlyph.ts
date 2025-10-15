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
    private uv: {u0: number, v0: number, u1: number, v1: number};
    private resolution: [number, number];
    private offset: [number, number];
    private xAdvance: number;

    constructor(data: FontGlyphData, textureWidth: number, textureHeight: number) {
        this.char = data.char;
        this.uv = {
            u0: data.x / textureWidth, 
            v0: data.y / textureHeight,
            u1: (data.x + data.width) / textureWidth,
            v1: (data.y + data.height) / textureHeight
        };
        this.resolution = [data.width, data.height];
        this.offset = [data.xoffset, data.yoffset];
        this.xAdvance = data.xadvance;
    }

    getChar(): string {
        return this.char;
    }

    getUv(): {u0: number, v0: number, u1: number, v1: number} {
        return this.uv;
    }

    getResolution(): [number, number] {
        return this.resolution;
    }

    getOffset(): [number, number] {
        return this.offset;
    }

    getXAdvance(): number {
        return this.xAdvance;
    }
}