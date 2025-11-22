import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { TextureSlot } from "../../../webgl/gl/texture/TextureConstants";
import { RendererContext } from "../RendererContext";
import { BaseShaderPass } from "./BaseShaderPass";
import { MaskShaderPass } from "./MaskShaderPass";
import { ShaderPassOperation } from "./ShaderPassOperation";

export class CustomMergeMaskShaderPass implements ShaderPassOperation {
    private maskShaderPasses: MaskShaderPass;
    private effectShaderPasses: BaseShaderPass;
    
    private isEffectEnabled: boolean = true;

    constructor(maskShaderPasses: MaskShaderPass, effectShaderPasses: BaseShaderPass) 
    {
        this.maskShaderPasses = maskShaderPasses;
        this.effectShaderPasses = effectShaderPasses;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation {

        let effectedResultRT: RenderTargetOperation | undefined = undefined;

        let effected = context.getRenderTargetFromPool(RenderTargetSlot.RENDER_TARGET_EFFECTED)!;

        effectedResultRT = this.effectShaderPasses.render(gl, context, inputRenderTarget, effected, false);

        effectedResultRT.bind(TextureSlot.POST_EFFECTED);
        const resultRT = this.maskShaderPasses.render(gl, context, inputRenderTarget, outputRenderTarget, isBlit);
        effectedResultRT.unbind();

        return resultRT;
    }

    setEffectEnabled(enabled: boolean): void {
        this.isEffectEnabled = enabled;
        this.maskShaderPasses.setEffectEnabled(enabled);
        this.effectShaderPasses.setEffectEnabled(enabled);
    }

    getEffectEnabled(): boolean {
        return this.isEffectEnabled;
    }

}