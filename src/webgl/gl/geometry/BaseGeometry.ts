import { VertexArray } from "../buffer/VertexArray";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { GeometryOperation } from "./GeometryOperation";

export abstract class BaseGeometry implements GeometryOperation {
    protected vao: VertexArray;
    protected vertices: Float32Array;
    protected color: Float32Array;
    protected indices: Int16Array;

    constructor(gl: WebGL2RenderingContext) {
        this.vao = new VertexArray(gl);

        this.vertices = new Float32Array;
        this.color = new Float32Array;
        this.indices = new Int16Array;
    }

    abstract setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;

    bind(): void {
        this.vao.bind();
    }

    unbind(): void {
        this.vao.unbind();
    }

    getIndexCount(): number {
        return this.indices.length;
    }

    dispose(): void {
        this.vao.dispose();
    }
}