import { Color } from "../../color/Color";
export declare class WebGLUtility {
    private gl;
    constructor(canvas: HTMLCanvasElement);
    getWebGL2RenderingContext(): WebGL2RenderingContext;
    clearColor(color: Color): void;
    resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean;
    setViewport(canvas: HTMLCanvasElement): void;
    private initializeWebGL2RenderingContext;
}
