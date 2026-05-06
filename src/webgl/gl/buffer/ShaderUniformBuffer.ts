import { MathUtility } from "../../../math/MathUtility";
import { UniformPairs } from "../uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../uniform/ShaderUniformValue";
import { BaseBuffer } from "./BaseBuffer";

export class ShaderUniformBuffer extends BaseBuffer {
    private cpuBuffer: Float32Array = new Float32Array();
    private memberOffsets: Map<string, number> = new Map();
    private shouldTransfer: boolean = false;

    constructor(gl: WebGL2RenderingContext, uniforms: UniformPairs){
        super(gl);
        this.initialize(uniforms);

        Object.entries(uniforms).forEach(([key, value]) => {
            this.updateUniformValue(key, value);
        });

        this.shouldTransfer = true;
    }

    get BufferType(): number {
        return this.gl.UNIFORM_BUFFER;
    }

    bind(slot: number = -1): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);

        if (slot === -1) return;
        this.gl.bindBufferBase(this.BufferType, slot, this.buffer);
    }

    unbind(): void {
        this.gl.bindBuffer(this.BufferType, null);
    }

    setData(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
        this.gl.bufferData(this.BufferType, this.cpuBuffer, this.gl.DYNAMIC_DRAW);
        this.shouldTransfer = false;
    }

    dispose(): void {
        if (this.buffer){
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }

    updateUniformValue(key: string, value: ShaderUniformValue): void {
        const offset = this.memberOffsets.get(key);
        if (offset == undefined) return;

        const data = value.getUniformValues();
        const index = offset / 4;
    
        if (typeof data === "number") {
            if (this.cpuBuffer[index] === data) return;
            this.cpuBuffer[index] = data;
        }
        else {
            this.cpuBuffer.set(data, index);
        }

        this.shouldTransfer = true;
    }

    transferUniform(): void {
        if (!this.shouldTransfer) return;

        this.gl.bindBuffer(this.BufferType, this.buffer);
        this.gl.bufferSubData(this.BufferType, 0, this.cpuBuffer);
        this.shouldTransfer = false;
    }

    private initialize(uniforms: UniformPairs): void {
        let currentOffset = 0;
        Object.entries(uniforms).forEach(([key, value]) => {
            const byteSize = value.getByteSize();
            currentOffset = MathUtility.ceil(currentOffset / byteSize) * byteSize;
            this.memberOffsets.set(key, currentOffset);
            currentOffset += byteSize;
        });

        const totalSize = MathUtility.ceil(currentOffset / 16) * 16;
        this.cpuBuffer = new Float32Array(totalSize / 4);
    }
}