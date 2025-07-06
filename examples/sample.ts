import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.BaseApplication {
    private program: GLSpinner.ShaderProgram;
    private modelMatrix: GLSpinner.Matrix44;
    private viewMatrix: GLSpinner.Matrix44;
    private projectionMatrix: GLSpinner.Matrix44;
    private vpMatrix: GLSpinner.Matrix44;
    private mvpMatrix: GLSpinner.Matrix44;
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
        this.program = this.shaderLoader.getShaderProgram("gouraudLighting");
        this.program.use(this.gl);

        const torus = new GLSpinner.Torus(this.gl, 32, 32, 1, 2);
        const attributes = {
            aPosition: this.program.getAttribute(this.gl, 'aPosition'),
            aNormal: this.program.getAttribute(this.gl, 'aNormal'),
            aColor: this.program.getAttribute(this.gl, 'aColor'),
        };
        torus.setUpBuffers(this.gl, attributes);

        const material = new GLSpinner.GouraudMaterial(
            this.program,
            new GLSpinner.Vector3(-0.5, 0.5, 0.5),
            new GLSpinner.Vector3(0, 0, 20.0),
            GLSpinner.ColorUtility.hexToColor01("#000000"));
        const mesh = new GLSpinner.SimpleMesh(torus, material);
        this.meshNode = new GLSpinner.MeshNode(mesh);

        this.modelMatrix = GLSpinner.MatrixCalculator.identity44();
        this.vpMatrix = GLSpinner.MatrixCalculator.identity44();
        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective);
        
        this.rendererContext.setCamera(this.camera);
        // this.rendererContext.updateGlobalUniform('resolution', new GLSpinner.ShaderUniformValue([this.canvas.width, this.canvas.height], 'float'));

        this.viewMatrix = this.camera.getViewMatrix();
        this.projectionMatrix = this.camera.getProjectionMatrix();
        this.mvpMatrix = GLSpinner.MatrixCalculator.multiply(
            GLSpinner.MatrixCalculator.multiply(
                this.projectionMatrix, 
                this.viewMatrix), 
                this.modelMatrix);

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
        this.modelMatrix = this.modelMatrix.rotateY(0.01);
        this.modelMatrix = this.modelMatrix.rotateZ(0.01);
        
        this.vpMatrix = this.projectionMatrix.multiply(this.viewMatrix, this.vpMatrix);
        this.mvpMatrix = this.vpMatrix.multiply(this.modelMatrix, this.mvpMatrix);
        const invertMatrix = this.modelMatrix.inverse();

        this.rendererContext.updateGlobalUniform('mvpMatrix', new GLSpinner.ShaderUniformValue(this.mvpMatrix));
        this.rendererContext.updateGlobalUniform('invMatrix', new GLSpinner.ShaderUniformValue(invertMatrix));
        // this.rendererContext.updateGlobalUniform('time',  new GLSpinner.ShaderUniformValue(0.0, 'float'));//this.scene.Clock.getElapsedTime(), 'float'));
        this.sceneGraph.update();

        this.meshNode.updateMaterialParams();
        this.meshNode.updateUniforms(this.gl, this.rendererContext);
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));
        this.sceneGraph.draw(this.gl, this.rendererContext);
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();