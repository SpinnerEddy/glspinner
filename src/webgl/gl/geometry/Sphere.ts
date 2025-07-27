import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { ColorUtility } from "../../../color/ColorUtility";
import { MathUtility } from "../../../math/MathUtility";
import { TrigonometricConstants } from "../../../math/ValueConstants";
import { Color } from "../../../color/Color";

export class Sphere extends BaseGeometry{
    constructor(gl: WebGL2RenderingContext, row: number, column: number, radius: number, color: Color = Color.empty()) {
        super(gl);

        const pos = [];
        const col = [];
        const indices = [];
        const normals = [];
        for(let i = 0; i <= row; i++){
            const r = TrigonometricConstants.PI / row * i;
            const rr = MathUtility.cos(r);
            const ry = MathUtility.sin(r);
            for(let ii = 0; ii <= column; ii++){
                const tr = TrigonometricConstants.PI * 2 / column * ii;
                const tx = rr * radius * MathUtility.cos(tr);
                const ty = ry * radius;
                const tz = rr * radius * MathUtility.sin(tr);
                const rx = rr * MathUtility.cos(tr);
                const rz = rr * MathUtility.sin(tr);
                pos.push(tx, ty, tz);
                normals.push(rx, ry, rz);
                if(Color.isEmpty(color)){
                    const tc = ColorUtility.hsvToRgb(360 / column * ii, 1, 1, 1)!;
                    col.push(tc.red, tc.green, tc.blue, tc.alpha);
                }
                else{
                    col.push(color.red, color.green, color.blue, color.alpha);
                }
            }
        }
        for(let i = 0; i < row; i++){
            for(let ii = 0; ii < column; ii++){
                const r = (column + 1) * i + ii;
                indices.push(r, r + 1, r + column + 2);
                indices.push(r, r + column + 2, r + column + 1);
            }
        }

        this.vertices = new Float32Array(pos);

        this.color = new Float32Array(col);

        this.indices = new Int16Array(indices);

        this.normal = new Float32Array(normals);
    }

    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(gl, this.vertices, this.color, this.normal);
        const ib = new IndexBuffer(gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aNormal) * Float32Array.BYTES_PER_ELEMENT;
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

        this.vao.addBuffer("geometry", gb);
        this.vao.addBuffer("index", ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }
}