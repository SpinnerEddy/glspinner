import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { FontGlyph } from "../font/FontGlyph";
import { Texture2D } from "../texture/Texture2D";
import { BaseGeometry } from "./BaseGeometry";
export declare class TextQuad extends BaseGeometry {
    protected uv: Float32Array;
    private width;
    private height;
    constructor(gl: WebGL2RenderingContext, text: Array<FontGlyph>, textTexture: Texture2D);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    get resolution(): [number, number];
}
