import { AudioOutput } from "../scene/audio/AudioOutput";
import { Scene } from "../scene/core/Scene";
import { SceneGraph } from "../scene/core/SceneGraph";
import { SceneRendererPipelineOperation } from "../scene/renderer/pipeline/SceneRendererPipelineOperation";
import { RendererContext } from "../scene/renderer/RendererContext";
import { TextFontLoader } from "../webgl/gl/font/TextFontLoader";
import { ShaderLoader } from "../webgl/gl/ShaderLoader";
import { TextureLoader } from "../webgl/gl/texture/TextureLoader";
import { WebGLUtility } from "../webgl/gl/WebGLUtility";
import { ApplicationOperation } from "./ApplicationOperation";
export declare abstract class BaseApplication implements ApplicationOperation {
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
    constructor(scene: Scene);
    start(): Promise<void>;
    preload(): Promise<void>;
    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}
