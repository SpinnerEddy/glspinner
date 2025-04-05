import { ShaderAttribute } from "../attribute/ShaderAttribute";

export interface GeometryOperation {
    setUpBuffers(attributes: Record<string, ShaderAttribute>): void;
    render(): void;
    dispose(): void;
}