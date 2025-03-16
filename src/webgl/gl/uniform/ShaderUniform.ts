import { UniformType } from "./ShaderUniformConstants";

export class ShaderUniform{
    private gl: WebGL2RenderingContext;
    private location: WebGLUniformLocation;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, uniformName: string){
        this.gl = gl;
        this.location = gl.getUniformLocation(program, uniformName)!;
        if(this.location === null){
            console.error(`Failed to get the storage location of ${uniformName}`);
        }
    }

    public setUniform(value: number | number[] | Float32Array | Int32Array, type: UniformType): void{
        if(this.location === null) return;

        switch(type){
            case '1f':
                this.gl.uniform1f(this.location, value as number);
                break;
            case '1fv':
                this.gl.uniform1fv(this.location, value as Float32Array);
                break;
            case '1i':
                this.gl.uniform1i(this.location, value as number);
                break;
            case '1iv':
                this.gl.uniform1iv(this.location, value as Int32Array);
                break;
            case '2f':
                this.gl.uniform2f(this.location, value as number[][0], value as number[][1]);
                break;
            case '2fv':
                this.gl.uniform2fv(this.location, value as Float32Array);
                break;
            case '2i':
                this.gl.uniform2i(this.location, value as number[][0], value as number[][1]);
                break;
            case '2iv':
                this.gl.uniform2iv(this.location, value as Int32Array);
                break;
            case '3f':
                this.gl.uniform3f(this.location, value as number[][0], value as number[][1], value as number[][2]);
                break;
            case '3fv':
                this.gl.uniform3fv(this.location, value as Float32Array);
                break;
            case '3i':
                this.gl.uniform3i(this.location, value as number[][0], value as number[][1], value as number[][2]);
                break;
            case '3iv':
                this.gl.uniform3iv(this.location, value as Int32Array);
                break;
            case '4f':
                this.gl.uniform4f(this.location, value as number[][0], value as number[][1], value as number[][2], value as number[][3]);
                break;
            case '4fv':
                this.gl.uniform4fv(this.location, value as Float32Array);
                break;
            case '4i':
                this.gl.uniform4i(this.location, value as number[][0], value as number[][1], value as number[][2], value as number[][3]);
                break;
            case '4iv':
                this.gl.uniform4iv(this.location, value as Int32Array);
                break;
            case 'Matrix2fv':
                this.gl.uniformMatrix2fv(this.location, false, value as Float32Array);
                break;
            case 'Matrix3fv':
                this.gl.uniformMatrix3fv(this.location, false, value as Float32Array);
                break;
            case 'Matrix4fv':
                this.gl.uniformMatrix4fv(this.location, false, value as Float32Array);
                break;
            default:
                throw new Error(`Unknown uniform type!!`);
        }
    }
}