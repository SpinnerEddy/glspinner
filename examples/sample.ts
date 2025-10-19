import * as GLSpinner from '../src/index.ts';

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
        await this.shaderLoader.loadShaderFromPath(
            "shader/basic.vert",
            "shader/basic.frag");
        await this.shaderLoader.loadShaderFromPath(
            "shader/spinner.vert",
            "shader/spinner.frag");
        await this.shaderLoader.loadShaderFromPath(
            "shader/testAudio.vert",
            "shader/testAudio.frag",
            ['oSample']);
        await this.textureLoader.loadTextureFromPath(
            "texture/testImage.png"
        );
        // await this.textFontLoader.loadTextFontFromPath(
        //     "font/OpenSans.png",
        //     "font/OpenSans.json"
        // );
        await this.textFontLoader.loadTextFontFromPath(
            "font/GideonRoman.png",
            "font/GideonRoman.json"
        );
        await this.textFontLoader.loadTextFontFromPath(
            "font/Roboto.png",
            "font/Roboto.json"
        );

        this.textFontLoader.setCurrentUseFontName("GideonRoman");

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        await this.shaderAudioInput.load("testAudio", this.audioOutput.getAudioContext());
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

        const text = "SPINNEREDDY";
        this.textRoot = new GLSpinner.EmptyNode();
        const glyphs = this.textFontLoader.getGlyphsFromText(text);
        const textPlane = new GLSpinner.TextQuad(this.gl, glyphs, this.textFontLoader.getTextureForCurrentFont()!);
        const textMaterial = GLSpinner.MaterialFactory.texturedTextMaterial(
            0.1,
            GLSpinner.MyColorCode.COLOR_HARUKI);
        const textPlaneAttributes = {
            aPosition: textMaterial.getAttribute(this.gl, 'aPosition'),
            aUv: textMaterial.getAttribute(this.gl, 'aUv'),
        }
        textPlane.setUpBuffers(this.gl, textPlaneAttributes);
        const textPlaneMesh = new GLSpinner.TextMesh(textPlane, textMaterial);
        const textPlaneMeshNode = new GLSpinner.TextMeshNode(textPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.textRoot, textPlaneMeshNode);
        GLSpinner.SceneGraphUtility.addChild(fboPlaneMeshNode, this.textRoot);

        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_A,
            new GLSpinner.RenderTarget(this.gl, [this.canvas.width, this.canvas.height]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_B,
            new GLSpinner.RenderTarget(this.gl, [this.canvas.width, this.canvas.height]));

        const standardRendererFlow = new GLSpinner.StandardSceneRendererFlow(
            this.baseSceneRoot);
        this.rendererFlowPipeline.addFlow(standardRendererFlow);

        const horizontalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 10.0));
        const verticalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 10.0));
        this.rendererContext.updateGlobalUniform("texResolution", new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height]));

        const graySceleShaderPass = new GLSpinner.GrayScaleShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.grayScaleMaterial());
            
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

        const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        this.rendererContext.updateGlobalUniform("shiftOffset", new GLSpinner.ShaderUniformValue(0.01));

        this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();        
        this.shaderPasses.set("blur(horizontal)", horizontalBlurShaderPass);
        this.shaderPasses.set("blur(vertical)", verticalBlurShaderPass);
        this.shaderPasses.set("grayScale", graySceleShaderPass);
        this.shaderPasses.set("grayScale", graySceleShaderPass);
        this.shaderPasses.set("mosaic", mosaicShaderPass);
        this.shaderPasses.set("rgbShift", rgbShiftShaderPass);
        this.shaderPasses.set("glitch", glitchShaderPass);
        this.shaderPasses.set("frameBufferOutput", frameBufferOutputPass);

        this.shaderPassEnabledSwitch = new Map<string, boolean>();
        this.shaderPassEnabledSwitch.set("blur(horizontal)", false);
        this.shaderPassEnabledSwitch.set("blur(vertical)", false);
        this.shaderPassEnabledSwitch.set("grayScale", false);
        this.shaderPassEnabledSwitch.set("mosaic", false);
        this.shaderPassEnabledSwitch.set("rgbShift", false);
        this.shaderPassEnabledSwitch.set("glitch", false);
        this.shaderPassEnabledSwitch.set("frameBufferOutput", true);

        const postEffectRendererFlow = new GLSpinner.PostEffectRendererFlow(
            this.shaderPasses);

        this.rendererFlowPipeline.addFlow(postEffectRendererFlow);

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
    }

    update(): void {
        GLSpinner.SceneGraphUtility.traverse(this.textRoot, (node) => {
            node.getTransform().setPosition(new GLSpinner.Vector3(-0.45, 0.3, 0.0));
            node.update();
        });

        this.rendererContext.updateGlobalUniform("time", new GLSpinner.ShaderUniformValue(this.scene.Clock.getElapsedTime()));
        this.rendererContext.updateGlobalUniform("resolution", new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height]));

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

        // this.scene.stop();
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();