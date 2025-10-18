import { BaseBuffer } from "./BaseBuffer";
export declare class IndexBuffer extends BaseBuffer {
    private indices;
    constructor(gl: WebGL2RenderingContext, indices: Int16Array);
    get BufferType(): number;
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
}
