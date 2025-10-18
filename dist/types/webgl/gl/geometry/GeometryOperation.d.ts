import { ShaderAttribute } from "../attribute/ShaderAttribute";
export interface GeometryOperation {
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    bind(): void;
    unbind(): void;
    getIndexCount(): number;
    dispose(): void;
}
