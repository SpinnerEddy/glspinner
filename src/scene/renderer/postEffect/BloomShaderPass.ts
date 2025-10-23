import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { BlurMaterial } from "../../material/BlurMaterial";
import { BrightMaterial } from "../../material/BrightMaterial";
import { ComposeMaterial } from "../../material/ComposeMaterial";
import { RendererContext } from "../RendererContext";
import { BrightShaderPass } from "./BrightShaderPass";
import { ComposeShaderPass } from "./ComposeShaderPass";
import { ShaderPassOperation } from "./ShaderPassOperation";
import { SingleDirectionBlurShaderPass } from "./SingleDirectionBlurShaderPass";

export class BloomShaderPass implements ShaderPassOperation {
    private brightShaderPass: BrightShaderPass;
    private horizontalBlurShaderPass: SingleDirectionBlurShaderPass;
    private verticalBlurShaderPass: SingleDirectionBlurShaderPass;
    private composeShaderPass: ComposeShaderPass;
    
    private isEffectEnabled: boolean = true;

    constructor(
        gl: WebGL2RenderingContext, 
        brightMaterial: BrightMaterial, 
        horizontalBlurMaterial: BlurMaterial, 
        verticalBlurMaterial: BlurMaterial,
        composeMaterial: ComposeMaterial,
        ) 
    {
        this.brightShaderPass = new BrightShaderPass(gl, brightMaterial);
        this.horizontalBlurShaderPass = new SingleDirectionBlurShaderPass(gl, horizontalBlurMaterial);
        this.verticalBlurShaderPass = new SingleDirectionBlurShaderPass(gl, verticalBlurMaterial);
        this.composeShaderPass = new ComposeShaderPass(gl, composeMaterial);
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {

        let resultRT: RenderTargetOperation | undefined = undefined;

        let writeTempRT = context.getRenderTargetFromPool(RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BRIGHT)!;

        resultRT = this.brightShaderPass.render(gl, context, inputRenderTarget, writeTempRT, false);

        let readTempRT = resultRT;
        writeTempRT = context.getRenderTargetFromPool(RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_H)!;

        resultRT = this.horizontalBlurShaderPass.render(gl, context, readTempRT, writeTempRT, false);

        readTempRT = resultRT;
        writeTempRT = context.getRenderTargetFromPool(RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_V)!;

        resultRT = this.verticalBlurShaderPass.render(gl, context, readTempRT, writeTempRT, false);

        readTempRT = resultRT;

        writeTempRT.bind(TextureSlot.BLOOM_FRAME);
        resultRT = this.composeShaderPass.render(gl, context, inputRenderTarget, outputRenderTarget, isBlit);
        writeTempRT.unbind();

        return resultRT;
    }

    setEffectEnabled(enabled: boolean): void {
        this.isEffectEnabled = enabled;
        this.brightShaderPass.setEffectEnabled(enabled);
        this.horizontalBlurShaderPass.setEffectEnabled(enabled);
        this.verticalBlurShaderPass.setEffectEnabled(enabled);
        this.composeShaderPass.setEffectEnabled(enabled);
    }

    getEffectEnabled(): boolean {
        return this.isEffectEnabled;
    }

}