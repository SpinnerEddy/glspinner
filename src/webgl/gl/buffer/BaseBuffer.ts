import { BufferOperation } from "./BufferOperation";

export abstract class BaseBuffer implements BufferOperation{
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null = null;

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
        this.buffer = this.gl.createBuffer();
    }

    get BufferType(): number {
        return this.gl.ARRAY_BUFFER;
    }

    abstract bind(): void;
    abstract unbind(): void;
    abstract setData(): void;
    abstract dispose(): void;
}