import { Matrix } from "../../../math/matrix/Matrix";
import { Vector } from "../../../math/vector/Vector";
import { NumberByte, UniformAvailableType, UniformType, UniformValueType } from "./ShaderUniformConstants";

export class ShaderUniformValue {
    private values: number | number[] | Float32Array | Int32Array;
    private type: UniformType;
    private byteSize: number;

    constructor(value: UniformAvailableType, type: UniformValueType = 'float'){
        this.values = this.getValue(value);
        this.type = this.getType(value, type);
        this.byteSize = this.calculateByteSize(value);
    }

    public getUniformValues(): number | number[] | Float32Array | Int32Array {
        return this.values;
    }

    public getUniformType(): UniformType {
        return this.type;
    }

    public getByteSize(): number {
        return this.byteSize;
    }

    private getValue(values: UniformAvailableType): number | number[] | Float32Array | Int32Array {
        if (typeof values === 'number'){
            return values;
        }
        else if (Array.isArray(values)){
            return values;
        }
        else if (values instanceof Matrix){
            return values.toArray();
        }
        else if (values instanceof Vector){
            return values.values;
        }
        else if (values instanceof Float32Array){
            return values;
        }
        else if (values instanceof Int32Array){
            return values;
        }
        else {
            throw new Error('Invalid uniform values type');
        }
    }

    private getType(values: UniformAvailableType, type: UniformValueType): UniformType {
        if (typeof values === 'number'){
            return this.isFloat(type) ? '1f' : '1i';
        }
        else if (Array.isArray(values)){
            switch (values.length){
                case 1:
                    return this.isFloat(type) ? '1fv' : '1iv';
                case 2:
                    return this.isFloat(type) ? '2fv' : '2iv';
                case 3:
                    return this.isFloat(type) ? '3fv' : '3iv';
                case 4:
                    return this.isFloat(type) ? '4fv' : '4iv';
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Vector){
            switch (values.size){
                case 1:
                    return this.isFloat(type) ? '1fv' : '1iv';
                case 2:
                    return this.isFloat(type) ? '2fv' : '2iv';
                case 3:
                    return this.isFloat(type) ? '3fv' : '3iv';
                case 4:
                    return this.isFloat(type) ? '4fv' : '4iv';
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Matrix){
            switch (values.size){
                case 2:
                    return 'Matrix2fv';
                case 3:
                    return 'Matrix3fv';
                case 4:
                    return 'Matrix4fv';
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Float32Array){
            switch (values.length){
                case 2:
                    return '2fv';
                case 3:
                    return '3fv';
                case 4:
                    return '4fv';
                default:
                    return '1fv';;
            }
        }
        else if (values instanceof Int32Array){
            switch (values.length){
                case 2:
                    return '2iv';
                case 3:
                    return '3iv';
                case 4:
                    return '4iv';
                default:
                    return '1iv';;
            }
        }
        else {
            throw new Error('Invalid uniform values type');
        }
    }

    private calculateByteSize(values: UniformAvailableType): number {
        if (typeof values === 'number'){
            return NumberByte;
        }
        else if (Array.isArray(values)){
            switch (values.length){
                case 1:
                    return NumberByte;
                case 2:
                    return NumberByte * 2;
                case 3:
                case 4:
                    return NumberByte * 4;
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Vector){
            switch (values.size){
                case 1:
                    return NumberByte;
                case 2:
                    return NumberByte * 2;
                case 3:
                case 4:
                    return NumberByte * 4;
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Matrix){
            switch (values.size){
                case 2:
                    return NumberByte * 4 * 2;
                case 3:
                    return NumberByte * 4 * 3;
                case 4:
                    return NumberByte * 4 * 4;
                default:
                    throw new Error('Invalid uniform values type');
            }
        }
        else if (values instanceof Float32Array){
            switch (values.length){
                case 1:
                    return NumberByte;
                case 2:
                    return NumberByte * 2;
                case 3:
                case 4:
                    return NumberByte * 4;
            }
        }
        else if (values instanceof Int32Array){
            switch (values.length){
                case 1:
                    return NumberByte;
                case 2:
                    return NumberByte * 2;
                case 3:
                case 4:
                    return NumberByte * 4;
            }
        }
        
        return NumberByte;
    }

    private isFloat(type: UniformValueType): boolean {
        return type == 'float';
    }
}