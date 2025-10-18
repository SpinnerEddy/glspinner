import { BaseBuffer } from "./BaseBuffer";
export declare class VertexArray {
    private gl;
    private vao;
    private buffers;
    constructor(gl: WebGL2RenderingContext);
    addBuffer(keyName: string, buffer: BaseBuffer): void;
    bindVao(): void;
    bind(): void;
    unbind(): void;
    unbindVao(): void;
    dispose(): void;
}
