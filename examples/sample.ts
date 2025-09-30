import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera!: GLSpinner.Camera;
    private backgroundColorStr!: string;
    private renderTarget!: GLSpinner.RenderTargetOperation;
    private planeMeshNode!: GLSpinner.MeshNode;
    private planeMeshNode2!: GLSpinner.MeshNode;
    private shaderAudioInput!: GLSpinner.ShaderAudioInput;

    async preload(): Promise<void> {
        await super.preload();
        await this.shaderLoader.loadShaderFromPath(
            "shader/basic.vert",
            "shader/basic.frag");
        await this.shaderLoader.loadShaderFromPath(
            "shader/audio.vert",
            "shader/audio.frag",
            ['oSample']);
        await this.textureLoader.loadTextureFromPath(
            "texture/testImage.png"
        );

        this.shaderAudioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, 100.0);
        await this.shaderAudioInput.load("audio", this.audioOutput.getAudioContext());
    }

    setup(): void {
        this.backgroundColorStr = "#000000";
        // const material = GLSpinner.MaterialFactory.unlitMaterial();
        this.renderTarget = new GLSpinner.RenderTarget(this.gl, [800, 800]);
        const frameBuffer = new GLSpinner.TextureFrameBuffer(this.gl, this.renderTarget.getTexture());
        const material = GLSpinner.MaterialFactory.frameBufferTextureMaterial(frameBuffer, 0);
        material.use(this.gl);

        const plane = new GLSpinner.Plane(this.gl, 5, 5);
        const planeAttributes = {
            aPosition: material.getAttribute(this.gl, 'aPosition'),
            aColor: material.getAttribute(this.gl, 'aColor'),
            aUv: material.getAttribute(this.gl, "aUv")
        };
        plane.setUpBuffers(this.gl, planeAttributes);

        const planeMesh = new GLSpinner.UnlitMesh(plane, material);
        this.planeMeshNode = new GLSpinner.MeshNode(planeMesh);

        const plane2 = new GLSpinner.Plane(this.gl, 25, 25);
        const planeAttributes2 = {
            aPosition: material.getAttribute(this.gl, 'aPosition'),
            aColor: material.getAttribute(this.gl, 'aColor'),
            aUv: material.getAttribute(this.gl, "aUv")
        };
        plane2.setUpBuffers(this.gl, planeAttributes2);

        const textureMaterial = GLSpinner.MaterialFactory.texturedMaterial("testImage", 0);
        const planeMesh2 = new GLSpinner.UnlitMesh(plane2, textureMaterial);
        this.planeMeshNode2 = new GLSpinner.MeshNode(planeMesh2);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective);
        this.rendererContext.setCamera(this.camera);
        // this.rendererContext.updateGlobalUniform('resolution', new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height], 'float'));

        let emptyNode = new GLSpinner.EmptyNode();
        GLSpinner.SceneGraphUtility.addChild(emptyNode, this.planeMeshNode);
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
        this.planeMeshNode.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, this.scene.Clock.getElapsedTime()));

        this.planeMeshNode2.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DY, this.scene.Clock.getElapsedTime()));
        this.planeMeshNode2.update();

        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            node.update();
        });
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));
        
        this.renderTarget.drawToFrameBuffer(() => {
            this.planeMeshNode2.draw(this.gl, this.rendererContext);
        });

        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            node.draw(this.gl, this.rendererContext);
        });
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();