import { Color } from "../../../color/Color";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
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

        let indexOffset = 0;
        
        // +x
        pos.push(halfWidth,  halfHeight, halfDepth);
        pos.push(halfWidth, -halfHeight, halfDepth);
        pos.push(halfWidth, -halfHeight, -halfDepth);
        pos.push(halfWidth,  halfHeight, -halfDepth);

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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

        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);
        col.push(1.0, 1.0, 1.0, 1.0);

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
        throw new Error("Method not implemented.");
    }

}