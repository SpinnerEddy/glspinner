import { BaseBuffer } from "./BaseBuffer";

export class VertexBuffer extends BaseBuffer{
    private vertices: Float32Array;

    constructor(gl: WebGL2RenderingContext, vertices: Float32Array){
        super(gl);
        this.vertices = vertices;
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
        this.gl.bufferData(this.BufferType, this.vertices, this.gl.STATIC_DRAW);
    }

    dispose(): void {
        if (this.buffer){
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }
}