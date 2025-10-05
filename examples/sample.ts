import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;
    private fboSceneRoot!: GLSpinner.EmptyNode;
    private grayScaleFboSceneRoot!: GLSpinner.EmptyNode;
    private renderTarget!: GLSpinner.RenderTargetOperation;
    private finalRenderTarget!: GLSpinner.RenderTargetOperation;

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
        this.fboSceneRoot = new GLSpinner.EmptyNode();
        this.grayScaleFboSceneRoot = new GLSpinner.EmptyNode();
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
        GLSpinner.SceneGraphUtility.addChild(this.fboSceneRoot, fboPlaneMeshNode);

        // グレースケールエフェクトをかける描画内容
        this.renderTarget = new GLSpinner.RenderTarget(this.gl, [this.canvas.width, this.canvas.height]);
        const frameBufferTexture = new GLSpinner.TextureFrameBuffer(this.gl, this.renderTarget.getTexture());
        const grayScaleMaterial = GLSpinner.MaterialFactory.grayScaleMaterial(frameBufferTexture, 0);
        const grayScalePlane = new GLSpinner.Plane(this.gl, 2, 2);
        const grayScaleAttributes = {
            aPosition: grayScaleMaterial.getAttribute(this.gl, 'aPosition'),
            aColor: grayScaleMaterial.getAttribute(this.gl, 'aColor'),
            aUv: grayScaleMaterial.getAttribute(this.gl, "aUv")
        };
        grayScalePlane.setUpBuffers(this.gl, grayScaleAttributes);
        const grayScalePlaneMesh = new GLSpinner.UnlitMesh(grayScalePlane, grayScaleMaterial);
        const grayScalePlaneMeshNode = new GLSpinner.MeshNode(grayScalePlaneMesh);
        GLSpinner.SceneGraphUtility.addChild(this.grayScaleFboSceneRoot, grayScalePlaneMeshNode);
        
        // 最終的に画面に表示する描画内容
        this.finalRenderTarget = new GLSpinner.RenderTarget(this.gl, [this.canvas.width, this.canvas.height]);
        const finalFrameBufferTexture = new GLSpinner.TextureFrameBuffer(this.gl, this.finalRenderTarget.getTexture());
        const frameBufferMaterial = GLSpinner.MaterialFactory.frameBufferTextureMaterial(finalFrameBufferTexture, 0);
        const plane = new GLSpinner.Plane(this.gl, 2, 2);
        const planeAttributes = {
            aPosition: frameBufferMaterial.getAttribute(this.gl, 'aPosition'),
            aColor: frameBufferMaterial.getAttribute(this.gl, 'aColor'),
            aUv: frameBufferMaterial.getAttribute(this.gl, "aUv")
        };
        plane.setUpBuffers(this.gl, planeAttributes);
        const planeMesh = new GLSpinner.UnlitMesh(plane, frameBufferMaterial);
        const planeMeshNode = new GLSpinner.MeshNode(planeMesh);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.rendererContext.setCamera(this.camera);
        // this.rendererContext.updateGlobalUniform('resolution', new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height], 'float'));

        let emptyNode = new GLSpinner.EmptyNode();
        GLSpinner.SceneGraphUtility.addChild(emptyNode, planeMeshNode);
        GLSpinner.SceneGraphUtility.addChild(this.sceneGraph.getGraph(), emptyNode);

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
        // GLSpinner.SceneGraphUtility.traverse(this.fboSceneRoot, (node) => {
        //     node.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, this.scene.Clock.getElapsedTime()));
        //     node.update();
        // });

        // GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
        //     node.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, this.scene.Clock.getElapsedTime()));
        //     node.update();
        // });
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));

        this.renderTarget.drawToFrameBuffer(() => {
            GLSpinner.SceneGraphUtility.traverse(this.fboSceneRoot, (node) => {
                node.draw(this.gl, this.rendererContext);
            });    
        });

        this.finalRenderTarget.drawToFrameBuffer(() => {
            GLSpinner.SceneGraphUtility.traverse(this.grayScaleFboSceneRoot, (node) => {
                node.draw(this.gl, this.rendererContext);
            });    
        });

        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            node.draw(this.gl, this.rendererContext);
        });
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();