import { ShaderProgram } from "./ShaderProgram";
export declare class ShaderLoader {
    private gl;
    private shaderProgramCache;
    private shaderProgramKey;
    constructor(gl: WebGL2RenderingContext);
    getShaderProgram(key: string): ShaderProgram;
    loadShaderFromPath(vertShaderPath: string, fragShaderPath: string, varyings?: string[]): Promise<void>;
    loadCommonShaders(): Promise<void>;
    loadShader(path: string): Promise<string>;
}
