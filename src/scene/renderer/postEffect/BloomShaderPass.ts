import { RenderTargetSlot } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
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

    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        const rtRegistry = context.getRenderTargetRegistry();
        let brightTempRT = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.BRIGHT_PASS_BUFFER)!;

        this.brightShaderPass.render(gl, context, inputRenderTarget, brightTempRT);

        let tempPPRT = rtRegistry.getPingPongRenderTargetFromPool(RenderTargetSlot.PINGPONG_TEMP_BUFFER)!; 

        this.horizontalBlurShaderPass.render(gl, context, brightTempRT, tempPPRT.write);
        tempPPRT.swap();
        this.verticalBlurShaderPass.render(gl, context, tempPPRT.read, tempPPRT.write);
        
        this.composeShaderPass.setBloomTexture(tempPPRT.write);
        this.composeShaderPass.render(gl, context, inputRenderTarget, outputRenderTarget);
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