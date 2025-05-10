export class ShaderAttribute {
    private location: number;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, attributeName: string) {
        this.location = gl.getAttribLocation(program, attributeName);
        if(this.location === -1){
            console.error(`Failed to get the storage location of ${attributeName}`);
        }
    }

    public setAttributeBuffer(gl: WebGL2RenderingContext, size: number, type: number, stride: number, offset: number): void{
        if(this.location === -1) return;

        gl.vertexAttribPointer(this.location, size, type, false, stride, offset);
        gl.enableVertexAttribArray(this.location);
    }
}