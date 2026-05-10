import { Matrix22 } from "../../../math/matrix/Matrix22";
import { Matrix33 } from "../../../math/matrix/Matrix33";
import { Matrix44 } from "../../../math/matrix/Matrix44";
import { Vector2 } from "../../../math/vector/Vector2";
import { Vector3 } from "../../../math/vector/Vector3";
import { Vector4 } from "../../../math/vector/Vector4";
import { ShaderUniformValue } from "./ShaderUniformValue";

export type UniformType = '1f' | '1fv' | '1i' | '1iv' | 
                          '2f' | '2fv' | '2i' | '2iv' | 
                          '3f' | '3fv' | '3i' | '3iv' | 
                          '4f' | '4fv' | '4i' | '4iv' | 
                          'Matrix2fv' | 'Matrix3fv' | 'Matrix4fv';

export type UniformAvailableType = number | number[] | Float32Array | Int32Array | 
                                   Matrix22 | Matrix33 | Matrix44 | 
                                   Vector2 | Vector3 | Vector4;

export type UniformValueType = 'float' | 'int'

export type UniformPairs = Record<string, ShaderUniformValue>;

export const NumberByte = 4;

export const UniformBindingPoint = 
{ 
    GLOBAL: 0,
    MATERIAL: 1,
    OBJECT: 2,
    LIGHT: 3,
    DEBUG: 10
} as const;

export type UniformBindingPointKey = typeof UniformBindingPoint[keyof typeof UniformBindingPoint];

export const GlobalUniformKey = 
{
    VIEW_MATRIX: "viewMatrix",
    PROJECTION_MATRIX: "projectionMatrix",
    TIME: "time",
} as const;

export type GlobalUniformKeyValue = typeof GlobalUniformKey[keyof typeof GlobalUniformKey];