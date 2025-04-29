import * as GLSpinner from '../src/index.ts';

class Sample extends GLSpinner.RecordingApplication {
    private program: GLSpinner.ShaderProgram;
    private rect: GLSpinner.Rectangle;
    private modelMatrix: GLSpinner.Matrix44;
    private viewMatrix: GLSpinner.Matrix44;
    private projectionMatrix: GLSpinner.Matrix44;
    private vpMatrix: GLSpinner.Matrix44;
    private mvpMatrix: GLSpinner.Matrix44;
    private camera: GLSpinner.Camera;
    private backgroundColorStr: string;

    private fps: number;
    private frameNum: number;

    async preload(): Promise<void> {
        await super.preload();
        await this.shaderLoader.loadShaderFromPath(
            "shader/basic.vert",
            "shader/basic.frag");
    }

    setup(): void {
        this.program = this.shaderLoader.getShaderProgram("basic");
        this.program.use();

        this.rect = new GLSpinner.Rectangle(this.gl, 2, 2);
        const attributes = {
            aPosition: this.program.getAttribute('aPosition'),
        };
        this.rect.setUpBuffers(attributes);

        this.modelMatrix = GLSpinner.MatrixCalculator.identity44();
        this.vpMatrix = GLSpinner.MatrixCalculator.identity44();
        this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Orthography);
        this.viewMatrix = this.camera.getViewMatrix();
        this.projectionMatrix = this.camera.getProjectionMatrix();
        this.mvpMatrix = GLSpinner.MatrixCalculator.multiply(
            GLSpinner.MatrixCalculator.multiply(
                this.projectionMatrix, 
                this.viewMatrix), 
                this.modelMatrix);

        GLSpinner.GuiUtility.initialize();
        const guiElements = {
            color: GLSpinner.MyColorCode.COLOR_CHINA
        };
        GLSpinner.GuiUtility.addFolder("default");
        GLSpinner.GuiUtility.addColorElement(
            guiElements, 
            "color",
            (value: string) => {
                this.backgroundColorStr = value;
            });
        GLSpinner.GuiUtility.resetFolder();

        GLSpinner.GuiUtility.addFolder("Recording");
        GLSpinner.GuiUtility.addElement(
            {fps: 60}, 
            "fps",
            (value: number) => {
                this.fps = value;
            }
        );
        GLSpinner.GuiUtility.addElement(
            {frameNum: 300}, 
            "frameNum",
            (value: number) => {
                this.frameNum = value;
            }
        );
        GLSpinner.GuiUtility.addAction(() => {
            this.setRecordingOptions({
                type: 'StartAndStop',
                fps: 60,
                resolution: [800, 800],
                saveName: 'test',
                frameNum: 300,
            });
            this.startRecording();
        }, 
        "StartRecord");
        GLSpinner.GuiUtility.addAction(() => {
            this.endRecording();
        }, 
        "StopRecord");
    }

    update(): void {
        this.vpMatrix = this.projectionMatrix.multiply(this.viewMatrix, this.vpMatrix);
        this.mvpMatrix = this.vpMatrix.multiply(this.modelMatrix, this.mvpMatrix);

        this.program.setUniform('mvpMatrix',
             new GLSpinner.ShaderUniformValue(
                this.mvpMatrix));
        this.program.setUniform('time', 
            new GLSpinner.ShaderUniformValue(
                this.scene.Clock.getElapsedTime(),
                'float'));
        this.program.setUniform('resolution', 
            new GLSpinner.ShaderUniformValue(
                [this.canvas.width, this.canvas.height],
                'float'));
    }

    draw(): void {
        this.webglUtility.setViewport(this.canvas);
        this.webglUtility.clearColor(GLSpinner.ColorUtility.hexToColor01(this.backgroundColorStr));

        this.rect.render();
    }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();