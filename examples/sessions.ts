import * as GLSpinner from '../src/index.ts';
import sessionsShaderFrag from '../examples/shader/sessions.frag'
import sessionsShaderVert from '../examples/shader/sessions.vert';
import audioFrag from '../examples/shader/audio.frag';
import audioVert from '../examples/shader/audio.vert';
import gideonRomanPng from '../examples/font/Roboto.png'
import gideonRomanJson from '../examples/font/Roboto.json'

class Sessions extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;
    private shaderPasses!: Map<string, GLSpinner.ShaderPassOperation>;
    private shaderPassEnabledSwitch!: Map<string, boolean>;

    private textRoot!: GLSpinner.EmptyNode;
    private titleTextScale!: GLSpinner.Vector3;

    private nameTextScale!: GLSpinner.Vector3;
    private greetingTextScale!: GLSpinner.Vector3;

    private baseCameraPos!: GLSpinner.Vector3;
    private cameraPos!: GLSpinner.Vector3;
    private baseCameraLookAtPos!: GLSpinner.Vector3;
    private cameraLookAtPos!: GLSpinner.Vector3;

    private lightPos!: GLSpinner.Vector3;
    private boxSize!: GLSpinner.Vector3;

    private glitchCoef: number = 0.0;
    private blurStrength: number = 0.0;
    private rgbShiftValue: number = 0.01;

    private bpm: number = 128.0;
    private currentBlock: number = 0;

    async preload(): Promise<void> {
        await super.preload();
        this.shaderLoader.loadShaderFromSource(
            "sessions",
            sessionsShaderVert,
            sessionsShaderFrag);
        this.shaderLoader.loadShaderFromSource(
            "audio",
            audioVert,
            audioFrag,
            ['oSample']);
        this.textFontLoader.loadTextFontFromPathAndJsonText(
            "Roboto",
            gideonRomanPng,
            gideonRomanJson
        );

        this.textFontLoader.setCurrentUseFontName("Roboto");

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        await this.shaderAudioInput.load("audio", this.audioOutput.getAudioContext());

        this.setUpText();
    }

    setup(): void {
        this.backgroundColorStr = "#000000";

        this.setUpStandardRendererFlow();

        this.setUpRenderTarget();

        this.setUpPostEffectFlow();

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);

        this.audioOutput.setInput(this.shaderAudioInput);

        this.baseCameraPos = new GLSpinner.Vector3(0.0, 3.0, -6.0);
        this.cameraLookAtPos = new GLSpinner.Vector3(0.0, 0.0, 0.0);
        this.baseCameraLookAtPos = new GLSpinner.Vector3(0.0, 0.0, 0.0);
        this.lightPos = new GLSpinner.Vector3(0.0, 10.0, 0.0);
        this.boxSize = new GLSpinner.Vector3(12.0, 9.0, 12.0);

        this.shaderAudioInput.saveToWav();

        // this.audioOutput.playAudio();
        //this.canvas.requestPointerLock();
    }

    update(): void {
        GLSpinner.SceneGraphUtility.traverse(this.textRoot, (node) => {
            if(node.getId() == "role"){
                node.getTransform().setScale(this.nameTextScale);
            }
            if(node.getId() == "greeting"){
                node.getTransform().setScale(this.greetingTextScale);
            }
            if(node.getId() == "title"){
                node.getTransform().setScale(this.titleTextScale);
            }
            node.update();
        });

        const currentTime = this.scene.getClock().getElapsedTime();
        this.updateUniformByBpm(currentTime);

        this.rendererContext.updateGlobalUniform("time", new GLSpinner.ShaderUniformValue(currentTime));
        this.rendererContext.updateGlobalUniform("resolution", new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height]));
        this.rendererContext.updateFragmentCanvasUniform("cameraPos", new GLSpinner.ShaderUniformValue(this.cameraPos));
        this.rendererContext.updateFragmentCanvasUniform("cameraLookPos", new GLSpinner.ShaderUniformValue(this.cameraLookAtPos));
        this.rendererContext.updateFragmentCanvasUniform("lightPos", new GLSpinner.ShaderUniformValue(this.lightPos));
        this.rendererContext.updateFragmentCanvasUniform("blockNumber", new GLSpinner.ShaderUniformValue(this.currentBlock));
        this.rendererContext.updateFragmentCanvasUniform("boxSize", new GLSpinner.ShaderUniformValue(this.boxSize));
        this.rendererContext.updateGlobalUniform("glitchCoef", new GLSpinner.ShaderUniformValue(this.glitchCoef));
        this.rendererContext.updateGlobalUniform("blurStrength", new GLSpinner.ShaderUniformValue(this.blurStrength));
        this.rendererContext.updateGlobalUniform("brightThreshold", new GLSpinner.ShaderUniformValue(0.85));
        this.rendererContext.updateGlobalUniform("bloomStrength", new GLSpinner.ShaderUniformValue(10.0));
        this.rendererContext.updateGlobalUniform("shiftOffset", new GLSpinner.ShaderUniformValue(this.rgbShiftValue));

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

    setUpStandardRendererFlow(): void {
        // 元々の描画内容
        this.baseSceneRoot = new GLSpinner.EmptyNode();
        const fboPlane = new GLSpinner.Plane(this.gl, 2, 2);
        const fboMaterial = GLSpinner.MaterialFactory.fragmentCanvasMaterial("sessions");
        const fboPlaneAttributes = {
            aPosition: fboMaterial.getAttribute(this.gl, 'aPosition'),
        };
        fboPlane.setUpBuffers(this.gl, fboPlaneAttributes);
        const fboPlaneMesh = new GLSpinner.UnlitMesh(fboPlane, fboMaterial);
        const fboPlaneMeshNode = new GLSpinner.MeshNode(fboPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, fboPlaneMeshNode);

        GLSpinner.SceneGraphUtility.addChild(fboPlaneMeshNode, this.textRoot);
        const standardRendererFlow = new GLSpinner.StandardSceneRendererFlow(
            this.baseSceneRoot);
        this.rendererFlowPipeline.addFlow(standardRendererFlow);
    }

    setUpText(): void {
        this.titleTextScale = new GLSpinner.Vector3(1.6, 1.0, 1.0);
        this.textRoot = new GLSpinner.EmptyNode();

        const titleText1 = "TWIRL:STAGE"
        const titleTextPlaneMeshNode1 = this.setUpTextNode(titleText1, "title", this.textRoot);
        titleTextPlaneMeshNode1.getTransform().setPosition(new GLSpinner.Vector3(-0.96, -0.8, 1.0));
        titleTextPlaneMeshNode1.getTransform().setScale(new GLSpinner.Vector3(1.6, 2.0, 1.0));

        const nameText = "SPINNEREDDY";
        this.nameTextScale = new GLSpinner.Vector3(0.0, 0.0, 0.0);
        this.greetingTextScale = new GLSpinner.Vector3(0.0, 0.0, 0.0);
        
        const roleText = "MUSIC&GRAPHICS";
        const roleTextPlaneMeshNode = this.setUpTextNode(roleText, "role", this.textRoot);
        roleTextPlaneMeshNode.getTransform().setPosition(new GLSpinner.Vector3(-0.9, 0.0, 1.0));

        const nameTextPlaneMeshNode = this.setUpTextNode(nameText, "role", this.textRoot);
        nameTextPlaneMeshNode.getTransform().setPosition(new GLSpinner.Vector3(0.1, 0.0, 1.0));

        const greetingText4 = "SESSIONS2025";
        const greetingTextPlaneMeshNode4 = this.setUpTextNode(greetingText4, "greeting", this.textRoot);
        greetingTextPlaneMeshNode4.getTransform().setPosition(new GLSpinner.Vector3(-0.96, -0.5, 1.0));
        greetingTextPlaneMeshNode4.getTransform().setScale(new GLSpinner.Vector3(1.6, 2.0, 1.0));
    }

    setUpTextNode(text: string, tag: string, targetNode: GLSpinner.EmptyNode): GLSpinner.TextMeshNode {
        const glyphs = this.textFontLoader.getGlyphsFromText(text);
        const textPlane = new GLSpinner.TextQuad(this.gl, glyphs, this.textFontLoader.getTextureForCurrentFont()!);
        const textMaterial = GLSpinner.MaterialFactory.texturedTextMaterial(
            0.1,
            "#ffffff");
        const textPlaneAttributes = {
            aPosition: textMaterial.getAttribute(this.gl, 'aPosition'),
            aUv: textMaterial.getAttribute(this.gl, 'aUv'),
        }
        textPlane.setUpBuffers(this.gl, textPlaneAttributes);
        const textPlaneMesh = new GLSpinner.TextMesh(textPlane, textMaterial);
        const textPlaneMeshNode = new GLSpinner.TextMeshNode(textPlaneMesh, tag);
        GLSpinner.SceneGraphUtility.addChild(targetNode, textPlaneMeshNode);
        return textPlaneMeshNode;
    }

    setUpRenderTarget(): void {
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_A,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_B,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLUR_RENDER_TARGET_HALF,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BRIGHT,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_H,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_V,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
    }

    setUpPostEffectFlow(): void {
        const horizontalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 0.001));
        const verticalBlurShaderPass = new GLSpinner.SingleDirectionBlurShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 0.001));
        this.rendererContext.updateGlobalUniform("texResolution", new GLSpinner.ShaderUniformValue([this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));

        const bloomShaderPass = new GLSpinner.BloomShaderPass(
            this.gl,
            GLSpinner.MaterialFactory.brightMaterial(),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 0.001),
            GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 0.001),
            GLSpinner.MaterialFactory.composeMaterial()
        );

        const rgbShiftShaderPass = new GLSpinner.MosaicShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.rgbShiftMaterial());
        
        const glitchShaderPass = new GLSpinner.GlitchShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.glitchMaterial());
        this.rendererContext.updateGlobalUniform("glitchCoef", new GLSpinner.ShaderUniformValue(this.glitchCoef));

        const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        

        this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();
        this.shaderPasses.set("bloom", bloomShaderPass);
        this.shaderPasses.set("blur(horizontal)", horizontalBlurShaderPass);
        this.shaderPasses.set("blur(vertical)", verticalBlurShaderPass); 
        this.shaderPasses.set("rgbShift", rgbShiftShaderPass);
        this.shaderPasses.set("glitch", glitchShaderPass);
        this.shaderPasses.set("frameBufferOutput", frameBufferOutputPass);

        this.shaderPassEnabledSwitch = new Map<string, boolean>();
        this.shaderPassEnabledSwitch.set("bloom", true);
        this.shaderPassEnabledSwitch.set("blur(horizontal)", true);
        this.shaderPassEnabledSwitch.set("blur(vertical)", true);
        this.shaderPassEnabledSwitch.set("rgbShift", true);
        this.shaderPassEnabledSwitch.set("glitch", true);
        this.shaderPassEnabledSwitch.set("frameBufferOutput", true);

        const postEffectRendererFlow = new GLSpinner.PostEffectRendererFlow(
            this.shaderPasses);

        this.rendererFlowPipeline.addFlow(postEffectRendererFlow);
    }

    updateUniformByBpm(currentTime: number): void {
        const beat = GLSpinner.MathUtility.timeToBeat(currentTime, this.bpm);
        const wholeBeat = beat;
        const block = Math.floor(wholeBeat / 8.0);
        const fTime = GLSpinner.MathUtility.fract(wholeBeat / 8.0);
        this.currentBlock = Math.floor(wholeBeat);

        // 全部で24ブロック(1ブロック8ビート)
        let cameraPosOffset = new GLSpinner.Vector3(0.0, 0.0, 0.0);
        let cameraLookPosOffset = new GLSpinner.Vector3(0.0, 0.0, 0.0);

        let kickTime = GLSpinner.MathUtility.beatToTime(beat % 2, this.bpm);
        this.rgbShiftValue = 0.0;
        cameraPosOffset.x = Math.cos(currentTime*0.4)*5.0;
        cameraPosOffset.z = Math.sin(currentTime*0.4)*5.0;

        this.titleTextScale.x = 0.0;
        this.titleTextScale.y = 0.0;
        this.titleTextScale.z = 0.0;
        this.greetingTextScale.x = 0.0;
        this.greetingTextScale.y = 0.0;
        this.greetingTextScale.z = 0.0;
        switch(block){
            case 0:
                // マスク + カメラ制御
                cameraPosOffset.x = fTime * 6.0 - 3.0;
                cameraPosOffset.y = 0.0;
                cameraPosOffset.z = 0.0;
                cameraLookPosOffset.x = fTime * 6.0 - 3.0;
                cameraLookPosOffset.y = fTime * 6.0 - 3.0;
                cameraLookPosOffset.z = 0.0;
                this.blurStrength = 2.0 - GLSpinner.MathUtility.linearStep(0.0, 1.0, fTime);
                break;
            case 1:
                // マスク + カメラ制御
                cameraPosOffset.x = fTime * 6.0 - 3.0;
                cameraPosOffset.y = 0.0;
                cameraPosOffset.z = fTime * 6.0 - 3.0;
                cameraLookPosOffset.x = fTime * 6.0 - 3.0;
                cameraLookPosOffset.y = 0.0;
                cameraLookPosOffset.z = 0.0;
                this.blurStrength = GLSpinner.MathUtility.linearStep(0.9, 1.0, fTime) * 20.0;
                this.blurStrength = 1.0 - GLSpinner.MathUtility.linearStep(0.0, 1.0, fTime);
                break;
            case 2:
                // マスク + カメラ制御 + タイトル表示
                cameraPosOffset.x = -fTime * 6.0 + 3.0;
                cameraPosOffset.y = 0.0;
                cameraPosOffset.z = 0.0;
                cameraLookPosOffset.x = fTime * 6.0 - 3.0;
                cameraLookPosOffset.y = 0.0;
                cameraLookPosOffset.z = 0.0;
                this.rgbShiftValue = 0.003;
                this.blurStrength = Math.exp(-30.0 * fTime) * 20.0;
                this.titleTextScale.x = 1.6;
                this.titleTextScale.y = 2.0;
                this.titleTextScale.z = 1.0;
                this.greetingTextScale.x = 1.8;
                this.greetingTextScale.y = 2.2;
                this.greetingTextScale.z = 1.0;
                break;
            case 3:
                // マスク + カメラ制御 + 次の場面転換でグリッチ
                cameraPosOffset.x = fTime * 6.0 - 3.0;
                cameraPosOffset.y = 0.0;
                cameraPosOffset.z = 0.0;
                cameraLookPosOffset.x = fTime * 6.0 - 3.0;
                cameraLookPosOffset.y = 0.0;
                cameraLookPosOffset.z = 0.0;
                this.rgbShiftValue = 0.003;
                this.titleTextScale.x = 1.6;
                this.titleTextScale.y = 2.0;
                this.titleTextScale.z = 1.0;
                this.greetingTextScale.x = 1.8;
                this.greetingTextScale.y = 2.2;
                this.greetingTextScale.z = 1.0;
                this.glitchCoef = GLSpinner.MathUtility.linearStep(0.9, 1.0, fTime) * 40.0;
                break;
            case 4:
                // グリッチでイン
                // 独楽が回転し始める + グロー表現(リング、球、装飾)
                cameraPosOffset.y = 8.0;
                
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                this.blurStrength = 0.0;
                this.glitchCoef = Math.exp(-30.0 * fTime) * 0.4;
                break;
            case 5:
                // カメラ制御
                cameraPosOffset.y = 3.0;

                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 6:
                // カメラ制御 
                cameraPosOffset.y = 4.0;

                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 7:
                // カメラ制御 
                cameraPosOffset.y = 6.0;

                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                // this.shaderPassEnabledSwitch.set("glitch", false);
                break;
            case 8:
                // カメラ制御
                // フラッシュ
                break;
            case 9:
                // カメラ制御
                // フラッシュ
                break;
            case 10:
                // カメラ制御
                // フラッシュ
                break;
            case 11:
                // カメラ制御
                // フラッシュ
                // 次の場面転換でグリッチ
                this.blurStrength = GLSpinner.MathUtility.linearStep(0.9, 1.0, fTime) * 20.0;
                break;
            case 12:
                // カメラ制御
                // ぼかしからイン
                // 独楽が変形、回転加速、モーフィング、独楽がグロー + ボックスの装飾がレインボー
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                this.blurStrength = Math.exp(-30.0 * fTime) * 20.0;
                cameraPosOffset.y = 7.0 - fTime;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(11.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                // カメラ制御
                break;
            case 13:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                // カメラ制御
                cameraPosOffset.y = 6.0 - fTime;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(11.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 14:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                // カメラ制御
                cameraPosOffset.y = 5.0 - fTime;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(9.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 15:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                // カメラ制御
                cameraPosOffset.y = 4.0 - fTime;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(7.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 16:
                // グリッチでイン
                this.glitchCoef = Math.exp(-30.0 * fTime) * 0.4;
                this.blurStrength = Math.exp(-30.0 * fTime) * 20.0;
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                // カメラ制御
                cameraPosOffset.y = 3.0;
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 17:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;

                // カメラ制御
                cameraPosOffset.y = 3.0;
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 18:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;

                // カメラ制御
                cameraPosOffset.y = 3.0;
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 19:
                this.rgbShiftValue = Math.exp(-8.0 * kickTime) * 0.012;
                // 次の場面転換でグリッチ
                this.glitchCoef = GLSpinner.MathUtility.linearStep(0.9, 1.0, fTime) * 40.0;

                // カメラ制御
                cameraPosOffset.y = 3.0;
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 20:
                // エンディング
                // グリッチでイン
                this.glitchCoef = Math.exp(-30.0 * fTime) * 0.4;
                cameraPosOffset.x = Math.cos(currentTime*0.4)*(9.0 - fTime * 2.0);
                cameraPosOffset.y = 6.0 + fTime;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(9.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 21:
                cameraPosOffset.x = Math.cos(currentTime*0.4)*(7.0 - fTime * 2.0);
                cameraPosOffset.y = 7.0 - fTime * 2.0;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(7.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                break;
            case 22:
                cameraPosOffset.x = Math.cos(currentTime*0.4)*(5.0 - fTime * 2.0);
                cameraPosOffset.y = 5.0 - fTime * 2.0;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(5.0 - fTime * 2.0);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                this.blurStrength = GLSpinner.MathUtility.linearStep(0.0, 1.0, fTime) * 2.0;
                break;
            case 23:
                // マスクがかかって終了
                // 音と映像 : 名前 表示
                cameraPosOffset.x = Math.cos(currentTime*0.4)*(3.0 - fTime);
                cameraPosOffset.y = 3.0;
                cameraPosOffset.z = Math.sin(currentTime*0.4)*(3.0 - fTime);
                cameraPosOffset.x -= this.baseCameraPos.x;
                cameraPosOffset.y -= this.baseCameraPos.y;
                cameraPosOffset.z -= this.baseCameraPos.z;
                this.blurStrength = 2.0 + GLSpinner.MathUtility.linearStep(0.0, 1.0, fTime) * 2.0;
                break;
            case 24:
                // 音と映像 : 名前 表示
                this.blurStrength = 0.0;
                this.glitchCoef = Math.exp(-30.0 * fTime) * 0.4;
                this.rgbShiftValue = 0.003;
                this.nameTextScale.x = 1.2;
                this.nameTextScale.y = 2.0;
                this.nameTextScale.z = 1.0;
                break;
            case 25:
                // 音と映像 : 名前 表示
                // グリッチでイン
                this.glitchCoef = Math.exp(-30.0 * fTime) * 0.4;
                this.nameTextScale.x = 0.0;
                this.nameTextScale.y = 0.0;
                this.nameTextScale.z = 0.0;
                break;
            case 26:
                // 終了文言
                overlay.style.display = "flex";
                statusText.textContent = "Press Esc to exit.";
                break;
            default:
                break;
        }        
        
        this.cameraPos = this.baseCameraPos.add(cameraPosOffset, this.cameraPos);
        this.cameraLookAtPos = this.baseCameraLookAtPos.add(cameraLookPosOffset, this.cameraLookAtPos);
    }

    resizeRenderTarget(): void {
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.RENDER_TARGET_A)?.dispose();
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.RENDER_TARGET_B)?.dispose();
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.BLUR_RENDER_TARGET_HALF)?.dispose();
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BRIGHT)?.dispose();
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_H)?.dispose();
        this.rendererContext.getRenderTargetFromPool(GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_V)?.dispose();
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_A,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.RENDER_TARGET_B,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLUR_RENDER_TARGET_HALF,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BRIGHT,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_H,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
        this.rendererContext.addRenderTargetToPool(
            GLSpinner.RenderTargetSlot.BLOOM_TEMP_RENDER_TARGET_BLUR_V,
            new GLSpinner.RenderTarget(this.gl, [this.gl.drawingBufferWidth * 0.5, this.gl.drawingBufferHeight * 0.5]));
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sessions(scene);

const overlay = document.getElementById("overlay")!;
const startBtn = document.getElementById("startBtn")! as HTMLButtonElement;
const statusText = document.getElementById("statusText")!;
const fullScreenBtn = document.getElementById("fullScreenBtn")! as HTMLButtonElement;

statusText.textContent = "Loading...";
await sample.preload();
statusText.textContent = "Ready!";
startBtn.disabled = false;
fullScreenBtn.disabled = false;

fullScreenBtn.onclick = async () => {
    // フルスクリーン化
    if (document.body.requestFullscreen) {
        await document.body.requestFullscreen();
    }

    // リサイズイベント
    window.addEventListener("resize", () => sample.resizeRenderTarget());
    document.addEventListener("fullscreenchange", () => sample.resizeRenderTarget());

    // 初回リサイズ
    sample.resizeRenderTarget();
};

startBtn.onclick = async () => {
    overlay.style.display = "none";
    startBtn.disabled = false;
    fullScreenBtn.disabled = false;
    startBtn.style.visibility = "hidden";
    fullScreenBtn.style.visibility = "hidden";
    // 描画開始
    await sample.start();
};