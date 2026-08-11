import * as GLSpinner from '../src/index.ts';
import * as GLSpinnerTools from '../src/tools.ts';
import uboTestShaderFrag from '../examples/shader/uboTest.frag';
import uboTestShaderVert from '../examples/shader/uboTest.vert';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;
    private boxNode!: GLSpinner.MeshNode;
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
        this.backgroundColorStr = '#000000';

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

        // const bloomShaderPass = new GLSpinner.BloomShaderPass(
        //     this.gl,
        //     GLSpinner.MaterialFactory.brightMaterial(0.85),
        //     GLSpinner.MaterialFactory.singleDirectionBlurMaterial(false, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
        //     GLSpinner.MaterialFactory.singleDirectionBlurMaterial(true, 1.0, [this.gl.drawingBufferWidth, this.gl.drawingBufferHeight], 0.001),
        //     GLSpinner.MaterialFactory.composeMaterial(10.0)
        // );

        // this.rendererFlowPipeline.addPostEffectFlow(new GLSpinner.PostEffectRendererFlow(bloomShaderPass));

        // this.shaderPasses = new Map<string, GLSpinner.ShaderPassOperation>();
        // this.shaderPasses.set('bloom', bloomShaderPass);

        // this.shaderPassEnabledSwitch = new Map<string, boolean>();
        // this.shaderPassEnabledSwitch.set('bloom', false);

        // const frameBufferOutputPass = new GLSpinner.FinalBlitShaderPass(this.gl, GLSpinner.MaterialFactory.frameBufferTextureMaterial());
        // const finalBlitShaderPass = new GLSpinner.FinalBlitRendererFlow(frameBufferOutputPass);
        // this.rendererFlowPipeline.addFinalBlitFlow(finalBlitShaderPass);

        const boxMaterial = GLSpinner.MaterialFactory.phongMaterial();
        const box = new GLSpinner.Box(this.gl, 5, 5, 5);
        const boxAttributes = {
            aPosition: boxMaterial.getAttribute(this.gl, 'aPosition'),
            aColor: boxMaterial.getAttribute(this.gl, 'aColor'),
            aNormal: boxMaterial.getAttribute(this.gl, 'aNormal')
        };
        box.setUpBuffers(this.gl, boxAttributes);
        const boxMesh = new GLSpinner.SimpleMesh(box, boxMaterial);
        this.boxNode = new GLSpinner.MeshNode(boxMesh);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, this.boxNode);

        const light = GLSpinner.LightFactory.light(new GLSpinner.Color(0.1, 0.3, 0.8), 1.0);
        const lightNode = new GLSpinner.DirectionalLightNode(light);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, lightNode);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective);
        this.rendererContext.setCamera(this.camera);

        this.audioOutput.setInput(this.shaderAudioInput);

        GLSpinnerTools.PlaySceneGuiController.initialize(
            () => this.scene.start(),
            () => this.scene.stop()
        );
    }

    update(): void {
        const elapsed = this.scene.getClock().getElapsedTime();
        this.boxNode.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, elapsed));

        const lights: GLSpinner.LightParams[] = [];
        GLSpinner.SceneGraphUtility.traverse(this.baseSceneRoot, (node) => {
            if (node instanceof GLSpinner.LightNode) {
                lights.push(node.getLightData());
            }
            node.update();
        });
        this.rendererContext.setLights(lights);

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
