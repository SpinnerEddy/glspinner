import { Color } from "../../../color/Color";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { FontGlyph } from "../font/FontGlyph";
import { BaseGeometry } from "./BaseGeometry";

export class TextQuad extends BaseGeometry {
    protected uv: Float32Array;

    constructor(gl: WebGL2RenderingContext, text: Array<FontGlyph>, color: Color = Color.empty()) {
        super(gl);

        let cursorX = 0;
        let indexOffset = 0;
        let vertices = [];
        let uvs = [];
        let indices = [];
        let colors = [];

        for (const glyph of text) {

            const offset = glyph.getOffset();
            const resolution = glyph.getResolution();

            const x0 = offset[0] + cursorX;
            const y0 = offset[1];
            const x1 = x0 + resolution[0];
            const y1 = y0 + resolution[1];

            vertices.push(
                x0, y0, 0.0,
                x1, y0, 0.0,
                x0, y1, 0.0,
                x1, y1, 0.0
            );

            const uv = glyph.getUv();

            uvs.push(
                uv.u0, uv.v0,
                uv.u1, uv.v0,
                uv.u0, uv.v1,
                uv.u1, uv.v1
            );

            indices.push(
                0 + indexOffset, 1 + indexOffset, 2 + indexOffset,
                3 + indexOffset, 2 + indexOffset, 1 + indexOffset
            );

            if(Color.isEmpty(color))
            {
                colors.push(
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0
                );
            }
            else
            {
                colors.push(
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                );
            }

            indexOffset += 4;
            cursorX += glyph.getXAdvance();
        }

        this.vertices = new Float32Array(vertices);
        this.color = new Float32Array(colors);
        this.indices = new Int16Array(indices);
        this.uv = new Float32Array(uvs);
        this.normal = new Float32Array(this.vertices.length); // dummy
    }

    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(gl, this.vertices, this.color, this.normal, this.uv);
        const ib = new IndexBuffer(gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aUv + AttributeElementSize.aColor) * Float32Array.BYTES_PER_ELEMENT;
        attributes["aPosition"].setAttributeBuffer(
            gl,
            AttributeElementSize.aPosition, 
            gl.FLOAT, 
            stride, 
            0);
        attributes["aUv"].setAttributeBuffer(
            gl,
            AttributeElementSize.aUv,
            gl.FLOAT, 
            stride, 
            AttributeElementSize.aPosition * Float32Array.BYTES_PER_ELEMENT);
        attributes["aColor"]?.setAttributeBuffer(
            gl,
            AttributeElementSize.aColor,
            gl.FLOAT, 
            stride, 
            (AttributeElementSize.aPosition + AttributeElementSize.aUv) * Float32Array.BYTES_PER_ELEMENT);

        this.vao.addBuffer("geometry", gb);
        this.vao.addBuffer("index", ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }
}