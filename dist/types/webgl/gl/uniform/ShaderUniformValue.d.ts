import { UniformAvailableType, UniformType, UniformValueType } from "./ShaderUniformConstants";
export declare class ShaderUniformValue {
    private values;
    private type;
    private byteSize;
    constructor(value: UniformAvailableType, type?: UniformValueType);
    getUniformValues(): number | number[] | Float32Array | Int32Array;
    getUniformType(): UniformType;
    getByteSize(): number;
    private getValue;
    private getType;
    private calculateByteSize;
    private isFloat;
}
