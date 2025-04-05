import { IndexBuffer } from "../buffer/IndexBuffer";
import { VertexArray } from "../buffer/VertexArray";
import { VertexBuffer } from "../buffer/VertexBuffer";
import { ShaderAttribute } from "../ShaderAttribute";

export class Rectangle{
    private gl: WebGL2RenderingContext;
    private vao: VertexArray;
    private vertices: Float32Array;
    private indices: Int16Array;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vao = new VertexArray(gl);

        this.vertices = new Float32Array([
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0,
        ]);

        this.indices = new Int16Array([
            0, 1, 2, 2, 3, 0
        ]);
    }

    setUpBuffers(attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        var vb = new VertexBuffer(this.gl, this.vertices);
        var ib = new IndexBuffer(this.gl, this.indices);

        vb.setData();
        ib.setData();

        attributes["aPosition"].setAttributeBuffer(3, this.gl.FLOAT, 0, 0);

        this.vao.addBuffer("vertex", vb);
        this.vao.addBuffer("index", ib);

        vb.unbind();
        ib.unbind();

        this.vao.unbindVao();
    }

    render(): void {
        this.vao.bind();
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        this.vao.unbind();
    }

    dispose(): void {
        this.vao.dispose();
    }
}