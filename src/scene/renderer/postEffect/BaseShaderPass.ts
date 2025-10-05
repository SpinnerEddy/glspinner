import { PingPongRenderTarget } from "../../../webgl/gl/fbo/PingPongRenderTarget";
import { Plane } from "../../../webgl/gl/geometry/Plane";
import { BaseMaterial } from "../../material/BaseMaterial";
import { ShaderPassOperation } from "./ShaderPassOperation";

export abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: Plane;
    protected pingPongRenderTarget: PingPongRenderTarget;

    constructor(gl: WebGL2RenderingContext, material: BaseMaterial, resolution: [number, number]){
        this.material = material;
        this.plane = new Plane(gl, 2, 2);
        this.pingPongRenderTarget = new PingPongRenderTarget(gl, resolution);
    }

    setInput(): void {
        throw new Error("Method not implemented.");
    }

    setOutput(): void {
        throw new Error("Method not implemented.");
    }

    draw(gl: WebGL2RenderingContext, context: RenderingContext): void {
        throw new Error("Method not implemented.");
    }

}