import { Color } from "../../../color/Color";
import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
export declare class Plane extends BaseGeometry {
    protected uv: Float32Array;
    constructor(gl: WebGL2RenderingContext, width?: number, height?: number, color?: Color);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}
