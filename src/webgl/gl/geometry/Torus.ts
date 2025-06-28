import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { ColorUtility } from "../../../color/ColorUtility";

export class Torus extends BaseGeometry{
    constructor(gl: WebGL2RenderingContext, row: number, column: number, inRadius: number, outRadius: number) {
        super(gl);

        const pos = [];
        const col = [];
        const indices = [];
        for(var i = 0; i <= row; i++){
            var r = Math.PI * 2 / row * i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);
            for(var ii = 0; ii <= column; ii++){
                var tr = Math.PI * 2 / column * ii;
                var tx = (rr * inRadius + outRadius) * Math.cos(tr);
                var ty = ry * inRadius;
                var tz = (rr * inRadius + outRadius) * Math.sin(tr);
                pos.push(tx, ty, tz);
                var tc = ColorUtility.hsvToRgb(360 / column * ii, 1, 1, 1)!;
                col.push(tc[0], tc[1], tc[2], tc[3]);
            }
        }
        for(i = 0; i < row; i++){
            for(ii = 0; ii < column; ii++){
                r = (column + 1) * i + ii;
                indices.push(r, r + column + 1, r + 1);
                indices.push(r + column + 1, r + column + 2, r + 1);
            }
        }

        this.vertices = new Float32Array(pos);

        this.color = new Float32Array(col);

        this.indices = new Int16Array(indices);
    }

    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(gl, this.vertices, this.color);
        const ib = new IndexBuffer(gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aColor) * Float32Array.BYTES_PER_ELEMENT;
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

        this.vao.addBuffer("geometry", gb);
        this.vao.addBuffer("index", ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }
}