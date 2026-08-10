import * as GLSpinner from '../src/index.ts';
import * as GLSpinnerTools from '../src/tools.ts';
import uboTestShaderFrag from '../examples/shader/uboTest.frag';
import uboTestShaderVert from '../examples/shader/uboTest.vert';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;
    private shaderPasses!: Map<string, GLSpinner.ShaderPassOperation>;
    private shaderPassEnabledSwitch!: Map<string, boolean>;

    async preload(): Promise<void> {
        await super.preload();

        this.shaderLoader.loadShaderFromSource('uboTest', uboTestShaderVert, uboTestShaderFrag);
        await this.textureLoader.loadTextureFromPath('texture/testImage.png');

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        // await this.shaderAudioInput.load("testAudio", this.audioOutput.getAudioContext());
    }

    setup(): void {
        this.backgroundColorStr = '#e80f0f';

        // 元々の描画内容
        this.baseSceneRoot = new GLSpinner.EmptyNode();
        

        const rtRegistry = this.rendererContext.getRenderTargetRegistry();
        rtRegistry.addRenderTargetToPool(GLSpinner.RenderTargetSlot.CURRENT_FRAME, new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        rtRegistry.addRenderTargetToPool(GLSpinner.RenderTargetSlot.TEMP_FRAME_BUFFER, new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        rtRegistry.addRenderTargetToPool(GLSpinner.RenderTargetSlot.HALF_RES_BUFFER, new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        rtRegistry.addRenderTargetToPool(GLSpinner.RenderTargetSlot.BRIGHT_PASS_BUFFER, new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));

        rtRegistry.addPingPongRenderTargetToPool(
            GLSpinner.RenderTargetSlot.PINGPONG_TEMP_BUFFER,
            new GLSpinner.PingPongRenderTarget(
                new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]),
                new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight])
            )
        );

        rtRegistry.setScreenRenderTarget(new GLSpinner.ScreenRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));

        const standardRendererFlow = new GLSpinner.StandardSceneRendererFlow(this.baseSceneRoot);
        this.rendererFlowPipeline.addSceneRendererFlow(standardRendererFlow);

        const bloomShaderPass = new GLSpinner.BloomShaderPass(
            this.gl,
            GLSpinner.MaterialFactory.brightMaterial(0.85),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
            GLSpinner.MaterialFactory.composeMaterial(10.0)
        );

        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(bloomShaderPass));

        // this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();
        // this.shaderPasses.set('bloom', bloomShaderPass);

        // this.shaderPassEnabledSwitch = new Map<string, boolean>();
        // this.shaderPassEnabledSwitch.set('bloom', false);

        // const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(this.gl, GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        // const finalBlitShaderPass = new GLSpinner.FinalBlitRendererFlow(frameBufferOutputPass);
        // this.rendererFlowPipeline.addFinalBlitFlow(finalBlitShaderPass);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);

        this.audioOutput.setInput(this.shaderAudioInput);

        GLSpinnerTools.PlaySceneGuiController.initialize(
            () => this.scene.start(),
            () => this.scene.stop()
        );
    }

    update(): void {
        this.rendererContext.updateGlobalUniformValues(this.scene.getClock().getElapsedTime(), this.inputHub.getMousePosition());
        this.rendererContext.bindGlobalUniforms();
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));
        this.rendererFlowPipeline.render(this.gl, this.rendererContext);
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();
