import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { FrameBufferTexturedMaterial } from "../../material/FrameBufferTexturedMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";

export class FlipShaderPass extends BaseShaderPass {

    constructor(gl: WebGL2RenderingContext, material: FrameBufferTexturedMaterial, resolution: [number, number]){
        super(gl, material, resolution);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {
        inputRenderTarget!.bind(0)
        this.draw(gl, context, isBlit);
        inputRenderTarget!.unbind();

        return this.writeRenderTarget;
    }

}