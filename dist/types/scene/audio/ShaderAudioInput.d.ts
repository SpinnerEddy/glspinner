import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { AudioInputOperation } from "./AudioInputOperation";
export declare class ShaderAudioInput implements AudioInputOperation {
    private audioBuffer;
    private gl;
    private shaderLoader;
    private sampleRate;
    private duration;
    constructor(gl: WebGL2RenderingContext, shaderLoader: ShaderLoader, audioDuration?: number);
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}
