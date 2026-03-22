import * as GLSpinner from '../src/index.ts';
import spinnerShaderFrag from '../examples/shader/spinner.frag';
import spinnerShaderVert from '../examples/shader/spinner.vert';
import gideonRomanPng from '../examples/font/GideonRoman.png'
import gideonRomanJson from '../examples/font/GideonRoman.json'

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;
    private shaderPasses!: Map<string, GLSpinner.ShaderPassOperation>;
    private shaderPassEnabledSwitch!: Map<string, boolean>;
    private textRoot!: GLSpinner.EmptyNode;
    private cameraPos!: GLSpinner.Vector3;

    async preload(): Promise<void> {
        await super.preload();
        this.shaderLoader.loadShaderFromSource("spinner", spinnerShaderVert, spinnerShaderFrag);
        await this.textureLoader.loadTextureFromPath(
            "texture/testImage.png"
        );
        this.textFontLoader.loadTextFontFromPathAndJsonText("GideonRoman", gideonRomanPng, gideonRomanJson);
        await this.textFontLoader.loadTextFontFromPath(
            "font/Roboto.png",
            "font/Roboto.json"
        );

        this.textFontLoader.setCurrentUseFontName("GideonRoman");

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        // await this.shaderAudioInput.load("testAudio", this.audioOutput.getAudioContext());

        const text = "SPINNEREDDY";
        this.textRoot = new GLSpinner.EmptyNode();
        const glyphs = this.textFontLoader.getGlyphsFromText(text);
        const textPlane = new GLSpinner.TextQuad(this.gl, glyphs, this.textFontLoader.getTextureForCurrentFont()!);
        const textMaterial = GLSpinner.MaterialFactory.texturedTextMaterial(
            0.1,
            GLSpinner.MyColorCode.COLOR_CHINA);
        const textPlaneAttributes = {
            aPosition: textMaterial.getAttribute(this.gl, 'aPosition'),
            aUv: textMaterial.getAttribute(this.gl, 'aUv'),
        }
        textPlane.setUpBuffers(this.gl, textPlaneAttributes);
        const textPlaneMesh = new GLSpinner.TextMesh(textPlane, textMaterial);
        const textPlaneMeshNode = new GLSpinner.TextMeshNode(textPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.textRoot, textPlaneMeshNode);
    }

    setup(): void {
        this.backgroundColorStr = "#000000";

        // 元々の描画内容
        this.baseSceneRoot = new GLSpinner.EmptyNode();
        const fboPlane = new GLSpinner.Plane(this.gl, 2, 2);
        const fboMaterial = GLSpinner.MaterialFactory.fragmentCanvasMaterial("spinner");
        const fboPlaneAttributes = {
            aPosition: fboMaterial.getAttribute(this.gl, 'aPosition'),
        };
        fboPlane.setUpBuffers(this.gl, fboPlaneAttributes);
        const fboPlaneMesh = new GLSpinner.UnlitMesh(fboPlane, fboMaterial);
        const fboPlaneMeshNode = new GLSpinner.MeshNode(fboPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, fboPlaneMeshNode);
        this.cameraPos = new GLSpinner.Vector3(0.0, 0.5, -2.5);

        GLSpinner.SceneGraphUtility.addChild(fboPlaneMeshNode, this.textRoot);

        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_A,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_B,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLUR_RENDER_TARGET_HALF,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BRIGHT,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_H,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_V,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_EFFECTED,
            new GLSpinner.CustomRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        
        this.rendererContext.setScreenRenderTarget(
            new GLSpinner.ScreenRenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight])
        );

        const standardRendererFlow = new GLSpinner.StandardSceneRendererFlow(
            this.baseSceneRoot);
        this.rendererFlowPipeline.addFlow(standardRendererFlow);

        const horizontalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 0.001));
        const verticalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 0.001));
        this.rendererContext.updateGlobalUniform("texResolution", new GLSpinner.ShaderUniformValue([this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        const graySceleShaderPass = new GLSpinner.GrayScaleShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.grayScaleMaterial());

        const brightShaderPass = new GLSpinner.BrightShaderPass(
            this.gl,
            GLSpinner.MaterialFactory.brightMaterial());

        const bloomShaderPass = new GLSpinner.BloomShaderPass(
            this.gl,
            GLSpinner.MaterialFactory.brightMaterial(),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 0.001),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 0.001),
            GLSpinner.MaterialFactory.composeMaterial()
        );
            
        const mosaicShaderPass = new GLSpinner.MosaicShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.mosaicMaterial());
        this.rendererContext.updateGlobalUniform("mosaicSize", new GLSpinner.ShaderUniformValue(60.0));

        const rgbShiftShaderPass = new GLSpinner.MosaicShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.rgbShiftMaterial());
        
        const glitchShaderPass = new GLSpinner.GlitchShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.glitchMaterial());
        this.rendererContext.updateGlobalUniform("glitchCoef", new GLSpinner.ShaderUniformValue(0.3));
        this.rendererContext.updateGlobalUniform("shiftOffset", new GLSpinner.ShaderUniformValue(0.01));

        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(bloomShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(brightShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(horizontalBlurShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(verticalBlurShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(graySceleShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(mosaicShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(rgbShiftShaderPass));
        this.rendererFlowPipeline.addFlow(new GLSpinner.PostEffectRendererFlow(glitchShaderPass));

        this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();
        this.shaderPasses.set("bloom", bloomShaderPass);
        this.shaderPasses.set("bright", brightShaderPass);
        this.shaderPasses.set("blur(horizontal)", horizontalBlurShaderPass);
        this.shaderPasses.set("blur(vertical)", verticalBlurShaderPass);
        this.shaderPasses.set("grayScale", graySceleShaderPass);
        this.shaderPasses.set("mosaic", mosaicShaderPass);
        this.shaderPasses.set("rgbShift", rgbShiftShaderPass);
        this.shaderPasses.set("glitch", glitchShaderPass);

        this.shaderPassEnabledSwitch = new Map<string, boolean>();
        this.shaderPassEnabledSwitch.set("bloom", false);
        this.shaderPassEnabledSwitch.set("bright", false);
        this.shaderPassEnabledSwitch.set("blur(horizontal)", false);
        this.shaderPassEnabledSwitch.set("blur(vertical)", false);
        this.shaderPassEnabledSwitch.set("grayScale", false);
        this.shaderPassEnabledSwitch.set("mosaic", false);
        this.shaderPassEnabledSwitch.set("rgbShift", false);
        this.shaderPassEnabledSwitch.set("glitch", false);

        const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        const finalBlitShaderPass = new GLSpinner.FinalBlitRendererFlow(frameBufferOutputPass);
        this.rendererFlowPipeline.addFlow(finalBlitShaderPass);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);

        console.log(this.sceneGraph.getGraph());

        this.audioOutput.setInput(this.shaderAudioInput);
        
        GLSpinner.AudioGuiController.initialize(
            () => this.audioOutput.playAudio(),
            () => this.audioOutput.stopAudio()
        );
        GLSpinner.PostEffectGuiController.initialize(
            this.shaderPasses,
            this.shaderPassEnabledSwitch,
            (key: string, enabled: boolean) => {
                this.shaderPassEnabledSwitch.set(key, enabled);
            }
        );
        GLSpinner.PlaySceneGuiController.initialize(
            () => this.scene.start(),
            () => this.scene.stop()
        );

        GLSpinner.GuiUtility.addFolder("Lighting");
        GLSpinner.GuiUtility.addElementWithRange(
            {cameraPosX: -0.5}, 
            "cameraPosX",
            -1.0,
            1.0,
            (value: number) => {
                this.cameraPos.x = value;
            }
        );
        GLSpinner.GuiUtility.addElementWithRange(
            {cameraPosY: 0.5}, 
            "cameraPosY",
            0.0,
            1.0,
            (value: number) => {
                this.cameraPos.y = value;
            }
        );
        GLSpinner.GuiUtility.addElementWithRange(
            {cameraPosZ: -2.5}, 
            "cameraPosZ",
            -2.5,
            2.5,
            (value: number) => {
                this.cameraPos.z = value;
            }
        );
    }

    update(): void {
        GLSpinner.SceneGraphUtility.traverse(this.textRoot, (node) => {
            node.getTransform().setPosition(new GLSpinner.Vector3(-0.45, 0.3, 0.0));
            node.update();
        });

        this.rendererContext.updateGlobalUniform("time", new GLSpinner.ShaderUniformValue(this.scene.getClock().getElapsedTime()));
        this.rendererContext.updateGlobalUniform("resolution", new GLSpinner.ShaderUniformValue([this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        // this.rendererContext.updateGlobalUniform("blurStrength", new GLSpinner.ShaderUniformValue(0.5 + 0.5 * GLSpinner.MathUtility.sin(this.scene.Clock.getElapsedTime())));
        this.rendererContext.updateGlobalUniform("blurStrength", new GLSpinner.ShaderUniformValue(1.0));
        this.rendererContext.updateGlobalUniform("brightThreshold", new GLSpinner.ShaderUniformValue(0.85));
        this.rendererContext.updateGlobalUniform("bloomStrength", new GLSpinner.ShaderUniformValue(10.0));

        this.rendererContext.updateFragmentCanvasUniform("cameraPos", new GLSpinner.ShaderUniformValue(this.cameraPos));

        this.shaderPasses.forEach((pass, key) => {
            if(this.shaderPassEnabledSwitch.get(key)){
                pass.setEffectEnabled(true);
            }
            else{
                pass.setEffectEnabled(false);
            }
        });
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