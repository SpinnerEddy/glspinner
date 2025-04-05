import { VertexArray } from "../buffer/VertexArray";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { GeometryOperation } from "./GeometryOperation";

export abstract class Geometry implements GeometryOperation {
    protected gl: WebGL2RenderingContext;
    protected vao: VertexArray;
    protected vertices: Float32Array;
    protected color: Float32Array;
    protected indices: Int16Array;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vao = new VertexArray(gl);

        this.vertices = new Float32Array;
        this.color = new Float32Array;
        this.indices = new Int16Array;
    }

    abstract setUpBuffers(attributes: Record<string, ShaderAttribute>): void;

    render(): void {
        this.vao.bind();
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        this.vao.unbind();
    }

    dispose(): void {
        this.vao.dispose();
    }
}