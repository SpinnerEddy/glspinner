import { Color } from "../../../color/Color";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { GeometryBuffer } from "../buffer/GeometryBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { BaseGeometry } from "./BaseGeometry";

export class Box extends BaseGeometry {
    protected uv: Float32Array;

    constructor(gl: WebGL2RenderingContext, width: number, height: number, depth: number, color: Color = Color.empty()) {
        super(gl);

        const pos = [];
        const col = [];
        const uv = [];
        const indices = [];
        const normals = [];

        const halfWidth  = width * 0.5;
        const halfHeight = height * 0.5;
        const halfDepth  = depth * 0.5;

        const colorValues: [number, number, number, number] = Color.isEmpty(color) ? [1.0, 1.0, 1.0, 1.0] : [color.red, color.green, color.blue, color.alpha];

        let indexOffset = 0;
        
        // +x
        pos.push(halfWidth,  halfHeight, halfDepth);
        pos.push(halfWidth, -halfHeight, halfDepth);
        pos.push(halfWidth, -halfHeight, -halfDepth);
        pos.push(halfWidth,  halfHeight, -halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(0.0, 1.0);
        uv.push(1.0, 1.0);
        uv.push(1.0, 0.0);

        normals.push(1.0, 0.0, 0.0);
        normals.push(1.0, 0.0, 0.0);
        normals.push(1.0, 0.0, 0.0);
        normals.push(1.0, 0.0, 0.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);

        // -x
        indexOffset += 4;

        pos.push(-halfWidth,  halfHeight, halfDepth);
        pos.push(-halfWidth,  halfHeight, -halfDepth);
        pos.push(-halfWidth, -halfHeight, -halfDepth);
        pos.push(-halfWidth, -halfHeight, halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(1.0, 0.0);
        uv.push(1.0, 1.0);
        uv.push(0.0, 1.0);

        normals.push(-1.0, 0.0, 0.0);
        normals.push(-1.0, 0.0, 0.0);
        normals.push(-1.0, 0.0, 0.0);
        normals.push(-1.0, 0.0, 0.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);

        // +y
        indexOffset += 4;

        pos.push(halfWidth, halfHeight, halfDepth);
        pos.push(halfWidth, halfHeight, -halfDepth);
        pos.push(-halfWidth, halfHeight, -halfDepth);
        pos.push(-halfWidth, halfHeight, halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(1.0, 0.0);
        uv.push(1.0, 1.0);
        uv.push(0.0, 1.0);

        normals.push(0.0, 1.0, 0.0);
        normals.push(0.0, 1.0, 0.0);
        normals.push(0.0, 1.0, 0.0);
        normals.push(0.0, 1.0, 0.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);
        
        // -y
        indexOffset += 4;

        pos.push(halfWidth,  -halfHeight, halfDepth);
        pos.push(-halfWidth, -halfHeight, halfDepth);
        pos.push(-halfWidth, -halfHeight, -halfDepth);
        pos.push(halfWidth,  -halfHeight, -halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(0.0, 1.0);
        uv.push(1.0, 1.0);
        uv.push(1.0, 0.0);

        normals.push(0.0, -1.0, 0.0);
        normals.push(0.0, -1.0, 0.0);
        normals.push(0.0, -1.0, 0.0);
        normals.push(0.0, -1.0, 0.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);
        
        // +z
        indexOffset += 4;

        pos.push(halfWidth,  halfHeight, halfDepth);
        pos.push(-halfWidth,  halfHeight, halfDepth);
        pos.push(-halfWidth, -halfHeight, halfDepth);
        pos.push(halfWidth, -halfHeight, halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(1.0, 0.0);
        uv.push(1.0, 1.0);
        uv.push(0.0, 1.0);

        normals.push(0.0, 0.0, 1.0);
        normals.push(0.0, 0.0, 1.0);
        normals.push(0.0, 0.0, 1.0);
        normals.push(0.0, 0.0, 1.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);
        
        // -z
        indexOffset += 4;

        pos.push(halfWidth,  halfHeight, -halfDepth);
        pos.push(halfWidth, -halfHeight, -halfDepth);
        pos.push(-halfWidth, -halfHeight, -halfDepth);
        pos.push(-halfWidth,  halfHeight, -halfDepth);

        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);
        col.push(...colorValues);

        uv.push(0.0, 0.0);
        uv.push(0.0, 1.0);
        uv.push(1.0, 1.0);
        uv.push(1.0, 0.0);

        normals.push(0.0, 0.0, -1.0);
        normals.push(0.0, 0.0, -1.0);
        normals.push(0.0, 0.0, -1.0);
        normals.push(0.0, 0.0, -1.0);

        indices.push(0 + indexOffset, 1 + indexOffset, 2 + indexOffset, 0 + indexOffset, 2 + indexOffset, 3 + indexOffset);        

        this.vertices = new Float32Array(pos);
        this.color = new Float32Array(col);
        this.indices = new Int16Array(indices);
        this.normal = new Float32Array(normals);
        this.uv = new Float32Array(uv);
    }

    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        const gb = new GeometryBuffer(gl, this.vertices, this.color, this.normal, this.uv);
        const ib = new IndexBuffer(gl, this.indices);

        gb.setData();
        ib.setData();

        const stride = (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aNormal + AttributeElementSize.aUv) * Float32Array.BYTES_PER_ELEMENT;
        attributes['aPosition'].setAttributeBuffer(gl, AttributeElementSize.aPosition, gl.FLOAT, stride, 0);
        attributes['aColor']?.setAttributeBuffer(gl, AttributeElementSize.aColor, gl.FLOAT, stride, AttributeElementSize.aPosition * Float32Array.BYTES_PER_ELEMENT);
        attributes['aNormal']?.setAttributeBuffer(gl, AttributeElementSize.aNormal, gl.FLOAT, stride, (AttributeElementSize.aPosition + AttributeElementSize.aColor) * Float32Array.BYTES_PER_ELEMENT);
        attributes['aUv']?.setAttributeBuffer(
            gl,
            AttributeElementSize.aUv,
            gl.FLOAT,
            stride,
            (AttributeElementSize.aPosition + AttributeElementSize.aColor + AttributeElementSize.aNormal) * Float32Array.BYTES_PER_ELEMENT
        );

        this.vao.addBuffer('geometry', gb);
        this.vao.addBuffer('index', ib);

        gb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }

}