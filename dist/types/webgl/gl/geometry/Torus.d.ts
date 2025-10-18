import { ShaderAttribute } from "../attribute/ShaderAttribute";
import { BaseGeometry } from "./BaseGeometry";
import { Color } from "../../../color/Color";
export declare class Torus extends BaseGeometry {
    constructor(gl: WebGL2RenderingContext, row: number, column: number, inRadius: number, outRadius: number, color?: Color);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}
