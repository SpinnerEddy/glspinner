import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
export declare class Rectangle extends BaseGeometry {
    protected uv: Float32Array;
    constructor(gl: WebGL2RenderingContext, width?: number, height?: number);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}
