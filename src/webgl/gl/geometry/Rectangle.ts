import { ColorBuffer } from "../buffer/ColorBuffer";
import { IndexBuffer } from "../buffer/IndexBuffer";
import { VertexArray } from "../buffer/VertexArray";
import { VertexBuffer } from "../buffer/VertexBuffer";
import { ShaderAttribute } from "../ShaderAttribute";

export class Rectangle{
    private gl: WebGL2RenderingContext;
    private vao: VertexArray;
    private vertices: Float32Array;
    private indices: Int16Array;
    private color: Float32Array;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vao = new VertexArray(gl);

        this.vertices = new Float32Array([
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0,
        ]);

        this.color = new Float32Array([
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ]);

        this.indices = new Int16Array([
            0, 1, 2, 2, 3, 0
        ]);
    }

    setUpBuffers(attributes: Record<string, ShaderAttribute>): void {
        this.vao.bindVao();

        var vb = new VertexBuffer(this.gl, this.vertices);
        var cb = new ColorBuffer(this.gl, this.color);
        var ib = new IndexBuffer(this.gl, this.indices);

        vb.setData();
        attributes["aPosition"].setAttributeBuffer(3, this.gl.FLOAT, 0, 0);
        this.vao.addBuffer("vertex", vb);
        vb.unbind();

        cb.setData();
        attributes["aColor"].setAttributeBuffer(4, this.gl.FLOAT, 0, 0);
        this.vao.addBuffer("color", cb);
        cb.unbind();

        ib.setData();
        this.vao.addBuffer("index", ib);
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