import * as GLSpinner from '../src/index.ts';
import * as GLSpinnerTools from '../src/tools.ts';
import spinnerShaderFrag from '../examples/shader/spinner.frag';
import spinnerShaderVert from '../examples/shader/spinner.vert';
import uboTestShaderFrag from '../examples/shader/uboTest.frag';
import uboTestShaderVert from '../examples/shader/uboTest.vert';
import gideonRomanPng from '../examples/font/GideonRoman.png';
import gideonRomanJson from '../examples/font/GideonRoman.json';
import { DeviceName, KeyboardCode, MouseButton } from '../src/input/InputConstants.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;
    private shaderPasses!: Map<string, GLSpinner.ShaderPassOperation>;
    private shaderPassEnabledSwitch!: Map<string, boolean>;
    private textRoot!: GLSpinner.EmptyNode;

    async preload(): Promise<void> {
        await super.preload();
        this.shaderLoader.loadShaderFromSource('uboTest', uboTestShaderVert, uboTestShaderFrag);
        await this.textureLoader.loadTextureFromPath('texture/testImage.png');
        this.textFontLoader.loadTextFontFromPathAndJsonText('GideonRoman', gideonRomanPng, gideonRomanJson);
        await this.textFontLoader.loadTextFontFromPath('font/Roboto.png', 'font/Roboto.json');

        this.textFontLoader.setCurrentUseFontName('GideonRoman');

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        // await this.shaderAudioInput.load("testAudio", this.audioOutput.getAudioContext());

        const text = 'SPINNEREDDY';
        this.textRoot = new GLSpinner.EmptyNode();
        const glyphs = this.textFontLoader.getGlyphsFromText(text);
        const textPlane = new GLSpinner.TextQuad(this.gl, glyphs, this.textFontLoader.getTextureForCurrentFont()!);
        const textMaterial = GLSpinner.MaterialFactory.texturedTextMaterial(0.1, GLSpinner.MyColorCode.COLOR_CHINA);
        const textPlaneAttributes = {
            aPosition: textMaterial.getAttribute(this.gl, 'aPosition'),
            aUv: textMaterial.getAttribute(this.gl, 'aUv'),
        };
        textPlane.setUpBuffers(this.gl, textPlaneAttributes);
        const textPlaneMesh = new GLSpinner.TextMesh(textPlane, textMaterial);
        const textPlaneMeshNode = new GLSpinner.TextMeshNode(textPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.textRoot, textPlaneMeshNode);
    }

    setup(): void {
        this.backgroundColorStr = '#000000';

        // 元々の描画内容
        this.baseSceneRoot = new GLSpinner.EmptyNode();
        const fboPlane = new GLSpinner.Plane(this.gl, 2, 2);
        const fboMaterial = GLSpinner.MaterialFactory.fragmentCanvasMaterial('uboTest');
        const fboPlaneAttributes = {
            aPosition: fboMaterial.getAttribute(this.gl, 'aPosition'),
        };
        fboPlane.setUpBuffers(this.gl, fboPlaneAttributes);
        const fboPlaneMesh = new GLSpinner.UnlitMesh(fboPlane, fboMaterial);
        const fboPlaneMeshNode = new GLSpinner.MeshNode(fboPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, fboPlaneMeshNode);

        GLSpinner.SceneGraphUtility.addChild(fboPlaneMeshNode, this.textRoot);

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

        const horizontalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(this.gl, GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001));
        const verticalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(this.gl, GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001));
        const graySceleShaderPass = new GLSpinner.GrayScaleShaderPass(this.gl, GLSpinner.MaterialFactory.grayScaleMaterial());

        const brightShaderPass = new GLSpinner.BrightShaderPass(this.gl, GLSpinner.MaterialFactory.brightMaterial(0.85));

        const bloomShaderPass = new GLSpinner.BloomShaderPass(
            this.gl,
            GLSpinner.MaterialFactory.brightMaterial(0.85),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
            GLSpinner.MaterialFactory.composeMaterial(10.0)
        );

        const mosaicShaderPass = new GLSpinner.MosaicShaderPass(this.gl, GLSpinner.MaterialFactory.mosaicMaterial(60.0));

        const rgbShiftShaderPass = new GLSpinner.RGBShiftShaderPass(this.gl, GLSpinner.MaterialFactory.rgbShiftMaterial(0.01));

        const glitchShaderPass = new GLSpinner.GlitchShaderPass(this.gl, GLSpinner.MaterialFactory.glitchMaterial(0.3));

        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(bloomShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(brightShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(horizontalBlurShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(verticalBlurShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(graySceleShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(mosaicShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(rgbShiftShaderPass));
        this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(glitchShaderPass));

        this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();
        this.shaderPasses.set('bloom', bloomShaderPass);
        this.shaderPasses.set('bright', brightShaderPass);
        this.shaderPasses.set('blur(horizontal)', horizontalBlurShaderPass);
        this.shaderPasses.set('blur(vertical)', verticalBlurShaderPass);
        this.shaderPasses.set('grayScale', graySceleShaderPass);
        this.shaderPasses.set('mosaic', mosaicShaderPass);
        this.shaderPasses.set('rgbShift', rgbShiftShaderPass);
        this.shaderPasses.set('glitch', glitchShaderPass);

        this.shaderPassEnabledSwitch = new Map<string, boolean>();
        this.shaderPassEnabledSwitch.set('bloom', false);
        this.shaderPassEnabledSwitch.set('bright', false);
        this.shaderPassEnabledSwitch.set('blur(horizontal)', false);
        this.shaderPassEnabledSwitch.set('blur(vertical)', false);
        this.shaderPassEnabledSwitch.set('grayScale', false);
        this.shaderPassEnabledSwitch.set('mosaic', false);
        this.shaderPassEnabledSwitch.set('rgbShift', false);
        this.shaderPassEnabledSwitch.set('glitch', false);

        const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(this.gl, GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        const finalBlitShaderPass = new GLSpinner.FinalBlitRendererFlow(frameBufferOutputPass);
        this.rendererFlowPipeline.addFinalBlitFlow(finalBlitShaderPass);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);

        console.log(this.sceneGraph.getGraph());

        this.audioOutput.setInput(this.shaderAudioInput);

        GLSpinnerTools.PlaySceneGuiController.initialize(
            () => this.scene.start(),
            () => this.scene.stop()
        );
    }

    update(): void {
        GLSpinner.SceneGraphUtility.traverse(this.textRoot, (node) => {
            node.getTransform().setPosition(new GLSpinner.Vector3(-0.45, 0.3, 0.0));
            node.update();
        });


        this.rendererContext.updateGlobalUniformValues(this.scene.getClock().getElapsedTime(), this.inputHub.getMousePosition());
        this.rendererContext.bindGlobalUniforms();

        this.shaderPasses.forEach((pass, key) => {
            if (this.shaderPassEnabledSwitch.get(key)) {
                pass.setEffectEnabled(true);
            } else {
                pass.setEffectEnabled(false);
            }
        });

        this.shaderPassEnabledSwitch.set('grayScale', this.inputHub.isDown({ device: DeviceName.Keyboard, type: KeyboardCode.B }));
        this.shaderPassEnabledSwitch.set('glitch', this.inputHub.isDown({ device: DeviceName.Mouse, type: MouseButton.LEFT }));

        this.inputHub.update();
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
