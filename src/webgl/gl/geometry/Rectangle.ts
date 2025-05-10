import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";

export class Rectangle extends BaseGeometry{
    protected uv: Float32Array;

    constructor(gl: WebGL2RenderingContext, width: number = 1, height: number = 1) {
        super(gl);

        this.vertices = new Float32Array([
            -width*0.5, -height*0.5, 0.0,
             width*0.5, -height*0.5, 0.0,
             width*0.5,  height*0.5, 0.0,
            -width*0.5,  height*0.5, 0.0,
        ]);

        this.color = new Float32Array([
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ]);

        this.uv = new Float32Array([
            0.0, 0.0, 
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);

        this.indices = new Int16Array([
            0, 1, 2, 0, 2, 3
        ]);
    }

    setUpBuffers(attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(this.gl, this.vertices, this.color, this.uv);
        const ib = new IndexBuffer(this.gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aUv) * Float32Array.BYTES_PER_ELEMENT;
        attributes["aPosition"].setAttributeBuffer(
            AttributeElementSize.aPosition, 
            this.gl.FLOAT, 
            stride, 
            0);
        attributes["aColor"]?.setAttributeBuffer(
            AttributeElementSize.aColor,
            this.gl.FLOAT, 
            stride, 
            AttributeElementSize.aPosition * Float32Array.BYTES_PER_ELEMENT);
        attributes["aUv"]?.setAttributeBuffer(
            AttributeElementSize.aUv,
            this.gl.FLOAT, 
            stride, 
            (AttributeElementSize.aPosition + AttributeElementSize.aColor) * Float32Array.BYTES_PER_ELEMENT);

        this.vao.addBuffer("geometry", gb);
        this.vao.addBuffer("index", ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }
}