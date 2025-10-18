import { BaseBuffer } from "./BaseBuffer";
export declare class GeometryBuffer extends BaseBuffer {
    private interleavedArray;
    constructor(gl: WebGL2RenderingContext, vertices: Float32Array, color: Float32Array, normal: Float32Array, uv?: Float32Array);
    get BufferType(): number;
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
    createInterleavedArray(vertices: Float32Array, color: Float32Array, normal: Float32Array, uv: Float32Array): Float32Array;
}
