import { VertexArray } from "../buffer/VertexArray";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { GeometryOperation } from "./GeometryOperation";
export declare abstract class BaseGeometry implements GeometryOperation {
    protected vao: VertexArray;
    protected vertices: Float32Array;
    protected color: Float32Array;
    protected normal: Float32Array;
    protected indices: Int16Array;
    constructor(gl: WebGL2RenderingContext);
    abstract setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    bind(): void;
    unbind(): void;
    getIndexCount(): number;
    dispose(): void;
}
