import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private baseSceneRoot!: GLSpinner.EmptyNode;

    async preload(): Promise<void> {
        await super.preload();
        await this.shaderLoader.loadShaderFromPath(
            "shader/basic.vert",
            "shader/basic.frag");
        await this.shaderLoader.loadShaderFromPath(
            "shader/testAudio.vert",
            "shader/testAudio.frag",
            ['oSample']);
        await this.textureLoader.loadTextureFromPath(
            "texture/testImage.png"
        );

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        await this.shaderAudioInput.load("testAudio", this.audioOutput.getAudioContext());
    }

    setup(): void {
        this.backgroundColorStr = "#000000";

        // 元々の描画内容
        this.baseSceneRoot = new GLSpinner.EmptyNode();
        const fboPlane = new GLSpinner.Plane(this.gl, 2, 2);
        const fboMaterial = GLSpinner.MaterialFactory.texturedMaterial("testImage", 0);
        const fboPlaneAttributes = {
            aPosition: fboMaterial.getAttribute(this.gl, 'aPosition'),
            aColor: fboMaterial.getAttribute(this.gl, 'aColor'),
            aUv: fboMaterial.getAttribute(this.gl, "aUv")
        };
        fboPlane.setUpBuffers(this.gl, fboPlaneAttributes);
        const fboPlaneMesh = new GLSpinner.UnlitMesh(fboPlane, fboMaterial);
        const fboPlaneMeshNode = new GLSpinner.MeshNode(fboPlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, fboPlaneMeshNode);

        const standardRendererFlow = new GLSpinner.StandardSceneRendererFlow(
            this.baseSceneRoot,
            { useFbo: true,
              gl: this.gl,
              resolution: [this.canvas.width, this.canvas.height]
            });
        this.rendererFlowPipeline.addFlow(standardRendererFlow);

        const grayScelePass = new GLSpinner.GrayScalePass(
            this.gl, 
            GLSpinner.MaterialFactory.grayScaleMaterial(0), 
            [this.canvas.width, this.canvas.height]);
        const frameBufferOutputPass = new GLSpinner.FlipShaderPass(
            this.gl, 
            GLSpinner.MaterialFactory.frameBufferTextureMaterial(0), 
            [this.canvas.width, this.canvas.height]);
        const postEffectRendererFlow = new GLSpinner.PostEffectRendererFlow(
            [grayScelePass, frameBufferOutputPass],
            { useFbo: true,
              gl: this.gl,
              resolution: [this.canvas.width, this.canvas.height]
            });

        this.rendererFlowPipeline.addFlow(postEffectRendererFlow);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);

        this.gl.enable(this.gl.DEPTH_TEST);
    	this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.disable(this.gl.CULL_FACE);

        console.log(this.sceneGraph.getGraph());

        this.audioOutput.setInput(this.shaderAudioInput);
        
        GLSpinner.AudioGuiController.initialize(
            () => this.audioOutput.playAudio(),
            () => this.audioOutput.stopAudio()
        );
    }

    update(): void {
        // GLSpinner.SceneGraphUtility.traverse(this.baseSceneRoot, (node) => {
        //     node.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, this.scene.Clock.getElapsedTime()));
        //     node.update();
        // });
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