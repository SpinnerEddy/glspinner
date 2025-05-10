export interface MeshOperation{
    update(gl: WebGL2RenderingContext): void;
    draw(gl: WebGL2RenderingContext): void;
}