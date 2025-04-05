import { BaseBuffer } from "./BaseBuffer";

export class ColorBuffer extends BaseBuffer{
    private color: Float32Array;

    constructor(gl: WebGL2RenderingContext, color: Float32Array){
        super(gl);
        this.color = color;
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
        this.gl.bufferData(this.BufferType, this.color, this.gl.STATIC_DRAW);
    }

    dispose(): void {
        if (this.buffer){
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }
}