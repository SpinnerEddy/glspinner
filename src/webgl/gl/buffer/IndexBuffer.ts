import { BaseBuffer } from "./BaseBuffer";

export class IndexBuffer extends BaseBuffer{
    private indices: Int16Array;

    constructor(gl: WebGL2RenderingContext, indices: Int16Array){
        super(gl);
        this.indices = indices;
    }

    get BufferType(): number {
        return this.gl.ELEMENT_ARRAY_BUFFER;
    }

    bind(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
    }

    unbind(): void {
        this.gl.bindBuffer(this.BufferType, null);
    }

    setData(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
        this.gl.bufferData(this.BufferType, this.indices, this.gl.STATIC_DRAW);
    }

    dispose(): void {
        if (this.buffer){
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }
}