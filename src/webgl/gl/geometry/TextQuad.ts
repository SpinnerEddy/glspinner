import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { FontGlyph } from "../font/FontGlyph";
import { Texture2D } from "../texture/Texture2D";
import { BaseGeometry } from "./BaseGeometry";

export class TextQuad extends BaseGeometry {
    protected uv: Float32Array;

    private width: number = 0;
    private height: number = 0;

    constructor(gl: WebGL2RenderingContext, text: Array<FontGlyph>, textTexture: Texture2D) {
        super(gl);

        let cursorX = 0;
        let indexOffset = 0;
        let vertices = [];
        let uvs = [];
        let normals = [];
        let indices = [];
        let colors = [];

        const scaleW = 1.0 / textTexture.getTextureSize().width;
        const scaleH = 1.0 / textTexture.getTextureSize().height; 

        let maxY = 0;
        let minY = 0;

        for (const glyph of text) {

            const offset = glyph.getOffset();
            const resolution = glyph.getResolution();

            const x0Px = (offset[0] + cursorX);
            const y0Px = (offset[1]);
            const x1Px = x0Px + resolution[0];
            const y1Px = y0Px + resolution[1];

            const x0 = x0Px * scaleW;
            const y0 = y0Px * scaleH;
            const x1 = x1Px * scaleW;
            const y1 = y1Px * scaleH;

            vertices.push(
                x0, y0, 0.0,
                x1, y0, 0.0,
                x0, y1, 0.0,
                x1, y1, 0.0
            );

            const uv = glyph.getUv();

            uvs.push(
                uv.u0, uv.v1,
                uv.u1, uv.v1,
                uv.u0, uv.v0,
                uv.u1, uv.v0
            );

            indices.push(
                0 + indexOffset, 1 + indexOffset, 2 + indexOffset,
                3 + indexOffset, 2 + indexOffset, 1 + indexOffset
            );

            colors.push(
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0
            );

            normals.push(
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0
            );

            indexOffset += 4;
            cursorX += glyph.getXAdvance();

            maxY = Math.max(maxY, y1Px);
            minY = Math.min(minY, y0Px);
        }

        this.vertices = new Float32Array(vertices);
        this.color = new Float32Array(colors);
        this.indices = new Int16Array(indices);
        this.normal = new Float32Array(normals);
        this.uv = new Float32Array(uvs);

        this.width = cursorX * scaleW;
        this.height = (maxY - minY) * scaleH;
    }

    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(gl, this.vertices, this.color, this.normal, this.uv);
        const ib = new IndexBuffer(gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aNormal + AttributeElementSize.aUv) * Float32Array.BYTES_PER_ELEMENT;
        attributes["aPosition"].setAttributeBuffer(
            gl,
            AttributeElementSize.aPosition, 
            gl.FLOAT, 
            stride, 
            0);
        attributes["aColor"]?.setAttributeBuffer(
            gl,
            AttributeElementSize.aColor,
            gl.FLOAT, 
            stride, 
            AttributeElementSize.aPosition * Float32Array.BYTES_PER_ELEMENT);
        attributes["aNormal"]?.setAttributeBuffer(
            gl,
            AttributeElementSize.aNormal,
            gl.FLOAT, 
            stride, 
            (AttributeElementSize.aPosition + AttributeElementSize.aColor) * Float32Array.BYTES_PER_ELEMENT);
        attributes["aUv"]?.setAttributeBuffer(
            gl,
            AttributeElementSize.aUv,
            gl.FLOAT, 
            stride, 
            (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aNormal) * Float32Array.BYTES_PER_ELEMENT);

        this.vao.addBuffer("geometry", gb);
        this.vao.addBuffer("index", ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }

    get resolution(): [number, number] {
        return [this.width, this.height];
    }
}