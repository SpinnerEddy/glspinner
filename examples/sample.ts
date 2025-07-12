import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera: GLSpinner.Camera;
    private backgroundColorStr: string;
    private meshNode: GLSpinner.MeshNode;

    async preload(): Promise<void> {
        await super.preload();
        await this.shaderLoader.loadShaderFromPath(
            "shader/basic.vert",
            "shader/basic.frag");
    }

    setup(): void {
        this.backgroundColorStr = "#000000";
        const material = GLSpinner.MaterialFactory.phongMaterial();
        material.use(this.gl);

        const torus = new GLSpinner.Torus(this.gl, 32, 32, 1, 2);
        const attributes = {
            aPosition: material.getAttribute(this.gl, 'aPosition'),
            aNormal: material.getAttribute(this.gl, 'aNormal'),
            aColor: material.getAttribute(this.gl, 'aColor'),
        };
        torus.setUpBuffers(this.gl, attributes);

        const mesh = new GLSpinner.SimpleMesh(torus, material);
        this.meshNode = new GLSpinner.MeshNode(mesh);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective);
        this.rendererContext.setCamera(this.camera);
        // this.rendererContext.updateGlobalUniform('resolution', new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height], 'float'));

        let emptyNode = new GLSpinner.EmptyNode();
        GLSpinner.SceneGraphUtility.addChild(emptyNode, this.meshNode);
        GLSpinner.SceneGraphUtility.addChild(this.sceneGraph.getGraph(), emptyNode);

        this.gl.enable(this.gl.DEPTH_TEST);
    	this.gl.depthFunc(this.gl.LEQUAL);
    	this.gl.enable(this.gl.CULL_FACE);
        console.log(this.sceneGraph.getGraph());

        GLSpinner.LightGuiController.initialize();
    }

    update(): void {
        // ロジック専用
        this.meshNode.getTransform().setScale(new GLSpinner.Vector3(0.5, 0.5, 0.5));
        this.meshNode.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(new GLSpinner.Vector3(1.0, 0.0, 0.0), this.scene.Clock.getElapsedTime()));
        this.meshNode.getTransform().setPosition(new GLSpinner.Vector3(4.0 * GLSpinner.MathUtility.cos(this.scene.Clock.getElapsedTime()), 4.0 * GLSpinner.MathUtility.sin(this.scene.Clock.getElapsedTime()), 0.0));
        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            node.update();
        });
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));
        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            node.draw(this.gl, this.rendererContext);
        });
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();