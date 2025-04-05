export class ShaderAttribute {
    private gl: WebGL2RenderingContext;
    private location: number;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, attributeName: string) {
        this.gl = gl;
        this.location = gl.getAttribLocation(program, attributeName);
        if(this.location === -1){
            console.error(`Failed to get the storage location of ${attributeName}`);
        }
    }

    public setAttributeBuffer(size: number, type: number, stride: number, offset: number): void{
        if(this.location === -1) return;

        this.gl.vertexAttribPointer(this.location, size, type, false, stride, offset);
        this.gl.enableVertexAttribArray(this.location);
    }
}