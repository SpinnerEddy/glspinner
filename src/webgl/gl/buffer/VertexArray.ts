import { BaseBuffer } from "./BaseBuffer";

export class VertexArray{
    private gl: WebGL2RenderingContext;
    private vao: WebGLVertexArrayObject | null = null;
    private buffers: Map<string, BaseBuffer>;

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
        this.buffers = new Map<string, BaseBuffer>();
    }

    addBuffer(keyName: string, buffer: BaseBuffer): void {
        this.buffers.set(keyName, buffer);
    }

    bindVao(): void {
        if (this.vao == null) {
            this.vao = this.gl.createVertexArray();
        }

        this.gl.bindVertexArray(this.vao);
    }

    bind(): void {
        this.bindVao();
        for(const buffer of this.buffers.values()){
            buffer.bind();
        }
    }

    unbind(): void {
        this.unbindVao();
        for(const buffer of this.buffers.values()){
            buffer.unbind();
        }
    }

    unbindVao(): void {
        this.gl.bindVertexArray(null);
    }

    dispose(): void {
        for(const buffer of this.buffers.values()){
            buffer.dispose();
        }

        if (this.vao) {
            this.gl.deleteVertexArray(this.vao);
            this.vao = null;
        }
    }
}