import { Color } from "../../../color/Color";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { BaseGeometry } from "./BaseGeometry";

export class Plane extends BaseGeometry{
    protected uv: Float32Array;

    constructor(gl: WebGL2RenderingContext, width: number = 2, height: number = 2, color: Color = Color.empty()) {
        super(gl);

        this.vertices = new Float32Array([
            -width*0.5,  height*0.5, 0.0,
             width*0.5,  height*0.5, 0.0,
            -width*0.5, -height*0.5, 0.0,
             width*0.5, -height*0.5, 0.0,
        ]);

        if(Color.isEmpty(color))
        {
            this.color = new Float32Array([
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0
            ]);
        }
        else
        {
            this.color = new Float32Array([
                color.red, color.green, color.blue, color.alpha,
                color.red, color.green, color.blue, color.alpha,
                color.red, color.green, color.blue, color.alpha,
                color.red, color.green, color.blue, color.alpha,
            ]);
        }

        this.normal = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);

        this.uv = new Float32Array([
            0.0, 0.0, 
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]);

        this.indices = new Int16Array([
            0, 1, 2, 3, 2, 1
        ]);
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
}