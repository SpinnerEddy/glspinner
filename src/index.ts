// Color
export * from './color/Color';
export * from './color/Color255';
export * from './color/ColorConstants';
export * from './color/ColorUtility'

// Math
export * from './math/vector/Vector';
export * from './math/vector/Vector2';
export * from './math/vector/Vector3';
export * from './math/vector/Vector4';
export * from './math/vector/VectorConstants';
export * from './math/vector/VectorOperation';

export * from './math/matrix/Matrix';
export * from './math/matrix/Matrix22';
export * from './math/matrix/Matrix33';
export * from './math/matrix/Matrix44';
export * from './math/matrix/MatrixConstants';
export * from './math/matrix/MatrixOperation';

export * from './math/quaternion/Quaternion';

export * from './math/MathUtility';
export * from './math/MatrixCalculator';
export * from './math/VectorCalculator';
export * from './math/QuaternionCalculator';
export * from './math/ValueConstants';

// WebGL
export * from './webgl/gl/WebGLUtility';
export * from './webgl/gl/ShaderLoader';
export * from './webgl/gl/ShaderProgram';
export * from './webgl/gl/uniform/ShaderUniformValue';
export * from './webgl/gl/uniform/ShaderUniform';
export * from './webgl/gl/attribute/ShaderAttribute';
export * from './webgl/gl/attribute/ShaderAttributeConstants'
export * from './webgl/gl/buffer/VertexArray';
export * from './webgl/gl/buffer/BufferOperation';
export * from './webgl/gl/buffer/BaseBuffer';
export * from './webgl/gl/buffer/GeometryBuffer';
export * from './webgl/gl/buffer/IndexBuffer';

// Geometry
export * from './webgl/gl/geometry/Rectangle'
export * from './webgl/gl/geometry/Geometry'
export * from './webgl/gl/geometry/GeometryOperation'

export function initializeLibrary() {
    console.log("ライブラリが初期化されました");
}