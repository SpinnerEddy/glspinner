import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { GrayScaleMaterial } from "../../material/GrayScaleMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class GrayScaleShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: GrayScaleMaterial, resolution: [number, number]){
        super(gl, material, resolution);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(0)
        this.draw(gl, context, isBlit);
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

}