import { AudioOutput } from "../scene/audio/AudioOutput";
import { Scene } from "../scene/core/Scene";
import { SceneGraph } from "../scene/core/SceneGraph";
import { MaterialFactory } from "../scene/factory/MaterialFactory";
import { SceneRendererPipeline } from "../scene/renderer/pipeline/SceneRendererPipeline";
import { SceneRendererPipelineOperation } from "../scene/renderer/pipeline/SceneRendererPipelineOperation";
import { RendererContext } from "../scene/renderer/RendererContext";
import { TextFontLoader } from "../webgl/gl/font/TextFontLoader";
import { ShaderLoader } from "../webgl/gl/ShaderLoader";
import { TextureLoader } from "../webgl/gl/texture/TextureLoader";
import { WebGLUtility } from "../webgl/gl/WebGLUtility";
import { ApplicationOperation } from "./ApplicationOperation";

export abstract class BaseApplication implements ApplicationOperation{
    protected canvas: HTMLCanvasElement;
    protected webglUtility: WebGLUtility;
    protected gl: WebGL2RenderingContext;
    protected shaderLoader: ShaderLoader;
    protected textureLoader: TextureLoader;
    protected textFontLoader: TextFontLoader;
    protected scene: Scene;
    protected sceneGraph: SceneGraph;
    protected rendererContext: RendererContext; 
    protected audioOutput: AudioOutput;
    protected rendererFlowPipeline: SceneRendererPipelineOperation;

    constructor(scene: Scene){
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        this.webglUtility = new WebGLUtility(this.canvas);
        this.gl = this.webglUtility.getWebGL2RenderingContext();
        this.shaderLoader = new ShaderLoader(this.gl);
        this.textureLoader = new TextureLoader(this.gl);
        this.textFontLoader = new TextFontLoader(this.gl);
        this.scene = scene;
        this.rendererContext = new RendererContext();
        this.sceneGraph = new SceneGraph();
        this.audioOutput = new AudioOutput();
        this.rendererFlowPipeline = new SceneRendererPipeline();
    }

    public async start(): Promise<void> {
        await this.preload();
        MaterialFactory.init(this.shaderLoader, this.textureLoader, this.textFontLoader);
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this))
        this.scene.start();
    }

    async preload(): Promise<void> {
        await this.shaderLoader.loadCommonShaders();
    }

    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}