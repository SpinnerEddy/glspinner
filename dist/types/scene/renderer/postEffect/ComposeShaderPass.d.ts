import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ComposeMaterial } from "../../material/ComposeMaterial";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
export declare class ComposeShaderPass extends BaseShaderPass {
    private bloomTexture;
    constructor(gl: WebGL2RenderingContext, material: ComposeMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setBloomTexture(bloomFrame: RenderTargetOperation): void;
}
