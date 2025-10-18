import { BufferOperation } from "./BufferOperation";
export declare abstract class BaseBuffer implements BufferOperation {
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null;
    constructor(gl: WebGL2RenderingContext);
    get BufferType(): number;
    abstract bind(): void;
    abstract unbind(): void;
    abstract setData(): void;
    abstract dispose(): void;
}
