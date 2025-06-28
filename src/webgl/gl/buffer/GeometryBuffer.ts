import { AttributeElementSize } from "../attribute/ShaderAttributeConstants";
import { BaseBuffer } from "./BaseBuffer";

export class GeometryBuffer extends BaseBuffer{
    private interleavedArray: Float32Array;

    constructor(
        gl: WebGL2RenderingContext,
        vertices: Float32Array,
        color: Float32Array,
        normal: Float32Array,
        uv: Float32Array = new Float32Array
    ){
        super(gl);
        this.interleavedArray = this.createInterleavedArray(vertices, color, normal, uv);
    }

    get BufferType(): number {
        return this.gl.ARRAY_BUFFER;
    }

    bind(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
    }

    unbind(): void {
        this.gl.bindBuffer(this.BufferType, null);
    }

    setData(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
        this.gl.bufferData(this.BufferType, this.interleavedArray, this.gl.STATIC_DRAW);
    }

    dispose(): void {
        if (this.buffer){
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }

    createInterleavedArray(
        vertices: Float32Array,
        color: Float32Array,
        normal: Float32Array,
        uv: Float32Array
    ): Float32Array {
        const interleavedArray = new Float32Array(vertices.length + color.length + normal.length + uv.length);
        const vertexNum = vertices.length / AttributeElementSize.aPosition;
        const colorNum = color.length / AttributeElementSize.aColor;

        if(vertexNum != colorNum){
            throw new Error("Vertex array and color array must have the same length.");
        }
        
        let arrayIndex = 0;
        for(let i = 0; i < vertexNum; i++){
            const vertexOffset = i * AttributeElementSize.aPosition;
            interleavedArray.set(
                vertices.subarray(
                    vertexOffset, 
                    vertexOffset + AttributeElementSize.aPosition),
                arrayIndex);
            arrayIndex += AttributeElementSize.aPosition;

            const colorOffset = i * AttributeElementSize.aColor;
            interleavedArray.set(
                color.subarray(
                    colorOffset, 
                    colorOffset + AttributeElementSize.aColor),
                arrayIndex);
            arrayIndex += AttributeElementSize.aColor;

            // if(uv.length == 0) continue;

            if(normal.length > 0){
                const normalOffset = i * AttributeElementSize.aNormal;
                interleavedArray.set(
                    normal.subarray(
                        normalOffset, 
                        normalOffset + AttributeElementSize.aNormal),
                    arrayIndex);
                arrayIndex += AttributeElementSize.aNormal;
            }

            if(uv.length > 0){
                const uvOffset = i * AttributeElementSize.aUv;
                interleavedArray.set(
                    uv.subarray(
                        uvOffset, 
                        uvOffset + AttributeElementSize.aUv),
                    arrayIndex);
                arrayIndex += AttributeElementSize.aUv;
            }
        }
        console.log(interleavedArray);
        
        return interleavedArray;
    }
}