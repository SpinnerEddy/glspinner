import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { BlurMaterial } from "../../material/BlurMaterial";
import { BrightMaterial } from "../../material/BrightMaterial";
import { ComposeMaterial } from "../../material/ComposeMaterial";
import { RendererContext } from "../RendererContext";
import { ShaderPassOperation } from "./ShaderPassOperation";
export declare class BloomShaderPass implements ShaderPassOperation {
    private brightShaderPass;
    private horizontalBlurShaderPass;
    private verticalBlurShaderPass;
    private composeShaderPass;
    private isEffectEnabled;
    constructor(gl: WebGL2RenderingContext, brightMaterial: BrightMaterial, horizontalBlurMaterial: BlurMaterial, verticalBlurMaterial: BlurMaterial, composeMaterial: ComposeMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}
