import { UniformAvailableType, UniformType, UniformValueType } from "./ShaderUniformConstants";
export declare class ShaderUniformValue {
    private values;
    private type;
    constructor(value: UniformAvailableType, type?: UniformValueType);
    getUniformValues(): number | number[] | Float32Array | Int32Array;
    getUniformType(): UniformType;
    private getValue;
    private getType;
    private isFloat;
}
