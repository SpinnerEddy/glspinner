import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private camera: GLSpinner.Camera;
    private backgroundColorStr: string;
    private meshNode: GLSpinner.MeshNode;
    private planeMeshNode: GLSpinner.MeshNode;
    private directionalLightNode: GLSpinner.DirectionalLightNode;

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

        // const torus = new GLSpinner.Torus(this.gl, 32, 32, 1, 2);
        const sphere = new GLSpinner.Sphere(this.gl, 64, 64, 2, GLSpinner.ColorUtility.hexToColor01(GLSpinner.MyColorCode.COLOR_CHINA));
        const attributes = {
            aPosition: material.getAttribute(this.gl, 'aPosition'),
            aNormal: material.getAttribute(this.gl, 'aNormal'),
            aColor: material.getAttribute(this.gl, 'aColor'),
        };
        sphere.setUpBuffers(this.gl, attributes);

        const mesh = new GLSpinner.SimpleMesh(sphere, material);
        this.meshNode = new GLSpinner.MeshNode(mesh);

        const plane = new GLSpinner.Plane(this.gl, 2, 2, GLSpinner.ColorUtility.hexToColor01(GLSpinner.MyColorCode.COLOR_HARUKI));
        const planeAttributes = {
            aPosition: material.getAttribute(this.gl, 'aPosition'),
            aNormal: material.getAttribute(this.gl, 'aNormal'),
            aColor: material.getAttribute(this.gl, 'aColor'),
        };
        plane.setUpBuffers(this.gl, planeAttributes);

        const planeMesh = new GLSpinner.SimpleMesh(plane, material);
        this.planeMeshNode = new GLSpinner.MeshNode(planeMesh);

        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective);
        this.rendererContext.setCamera(this.camera);
        // this.rendererContext.updateGlobalUniform('resolution', new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height], 'float'));

        let emptyNode = new GLSpinner.EmptyNode();
        GLSpinner.SceneGraphUtility.addChild(emptyNode, this.meshNode);
        GLSpinner.SceneGraphUtility.addChild(emptyNode, this.planeMeshNode);
        GLSpinner.SceneGraphUtility.addChild(this.sceneGraph.getGraph(), emptyNode);

        let light = new GLSpinner.Light(
            GLSpinner.ColorUtility.hexToColor01("#000000"),
            1.0);
        // const directionalLightNode = new GLSpinner.DirectionalLightNode(light);
        // GLSpinner.SceneGraphUtility.addChild(this.sceneGraph.getGraph(), directionalLightNode);
        this.directionalLightNode = new GLSpinner.DirectionalLightNode(light);
        GLSpinner.SceneGraphUtility.addChild(this.sceneGraph.getGraph(), this.directionalLightNode);

        this.gl.enable(this.gl.DEPTH_TEST);
    	this.gl.depthFunc(this.gl.LEQUAL);
    	// this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.CULL_FACE);
        console.log(this.sceneGraph.getGraph());

        GLSpinner.LightGuiController.initialize();
    }

    update(): void {
        // ロジック専用
        // this.meshNode.getTransform().setScale(new GLSpinner.Vector3(0.5, 0.5, 0.5));
        this.planeMeshNode.getTransform().setRotation(GLSpinner.QuaternionCalculator.createFromAxisAndRadians(GLSpinner.DefaultVectorConstants.AXIS2DX, this.scene.Clock.getElapsedTime()));
        this.planeMeshNode.getTransform().setScale(new GLSpinner.Vector3(3, 3, 3));
        // this.pointLightNode.getTransform().setPosition(new GLSpinner.Vector3(0.0, 20.0 * GLSpinner.MathUtility.cos(this.scene.Clock.getElapsedTime()), 20.0 * GLSpinner.MathUtility.sin(this.scene.Clock.getElapsedTime())));
        // this.directionalLightNode.getTransform().setPosition(new GLSpinner.Vector3(10.0, 20.0, 20.0));
        const lights: GLSpinner.LightParams[] = [];
        GLSpinner.SceneGraphUtility.traverse(this.sceneGraph.getGraph(), (node) => {
            if(node instanceof GLSpinner.LightNode){
                lights.push(node.getLightData());
            }
            node.update();
        });
        this.rendererContext.setLights(lights);
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