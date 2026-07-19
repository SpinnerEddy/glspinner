import { UniformPairs } from "../uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../uniform/ShaderUniformValue";
import { BaseBuffer } from "./BaseBuffer";
export declare class ShaderUniformBuffer extends BaseBuffer {
    private cpuBuffer;
    private memberOffsets;
    private shouldTransfer;
    constructor(gl: WebGL2RenderingContext, uniforms: UniformPairs);
    get BufferType(): number;
    bind(slot?: number): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
    updateUniformValue(key: string, value: ShaderUniformValue): void;
    transferUniform(): void;
    private initialize;
}
