import { BufferOperation } from "./BufferOperation";

export class BaseBuffer implements BufferOperation{
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null = null;

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
        this.buffer = this.gl.createBuffer();
    }

    get BufferType(): number {
        return this.gl.ARRAY_BUFFER;
    }

    bind(): void {
        throw new Error("Method not implemented.");
    }

    unbind(): void {
        throw new Error("Method not implemented.");
    }

    setData(): void {
        throw new Error("Method not implemented.");
    }

    dispose(): void {
        throw new Error("Method not implemented.");
    }
}