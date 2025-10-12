import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { MosaicMaterial } from "../../material/MosaicMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class MosaicShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: MosaicMaterial, resolution: [number, number]){
        super(gl, material, resolution);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(0)
        this.draw(gl, context, isBlit);
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

}