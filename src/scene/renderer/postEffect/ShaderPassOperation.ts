export interface ShaderPassOperation {
    setInput(): void;
    setOutput(): void;
    draw(gl: WebGL2RenderingContext, context: RenderingContext): void;
}