export declare class ShaderAttribute {
    private location;
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, attributeName: string);
    setAttributeBuffer(gl: WebGL2RenderingContext, size: number, type: number, stride: number, offset: number): void;
}
