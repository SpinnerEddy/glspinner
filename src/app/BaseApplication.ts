import { Scene } from "../scene/core/Scene";
import { SceneGraph } from "../scene/core/SceneGraph";
import { RendererContext } from "../scene/renderer/RendererContext";
import { ShaderLoader } from "../webgl/gl/ShaderLoader";
import { WebGLUtility } from "../webgl/gl/WebGLUtility";
import { ApplicationOperation } from "./ApplicationOperation";

export abstract class BaseApplication implements ApplicationOperation{
    protected canvas: HTMLCanvasElement;
    protected webglUtility: WebGLUtility;
    protected gl: WebGL2RenderingContext;
    protected shaderLoader: ShaderLoader;
    protected scene: Scene;
    protected sceneGraph: SceneGraph;
    protected rendererContext: RendererContext;

    constructor(scene: Scene){
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        this.webglUtility = new WebGLUtility(this.canvas);
        this.gl = this.webglUtility.getWebGL2RenderingContext();
        this.shaderLoader = new ShaderLoader(this.gl);
        this.scene = scene;
        this.rendererContext = new RendererContext();
        this.sceneGraph = new SceneGraph();
    }

    public async start(): Promise<void> {
        await this.preload();
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