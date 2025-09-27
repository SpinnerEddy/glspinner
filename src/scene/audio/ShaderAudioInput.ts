import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { AudioInputOperation } from "./AudioInputOperation";

export class ShaderAudioInput implements AudioInputOperation {
    
    private audioBuffer: AudioBuffer | undefined;
    private gl: WebGL2RenderingContext;
    private shaderLoader: ShaderLoader;

    private sampleRate: number = 44100;
    private duration: number = 2.0;

    constructor(gl: WebGL2RenderingContext, shaderLoader: ShaderLoader, audioDuration: number = 2.0) {
        this.gl = gl;
        this.shaderLoader = shaderLoader;
        this.duration = audioDuration;
    }

    async load(path: string, audioContext: AudioContext): Promise<void> {
        const shader = this.shaderLoader.getShaderProgram(path);
        const sampleNums = Math.floor(this.sampleRate * this.duration);

        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, sampleNums * 2 * 4, gl.DYNAMIC_COPY);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);

        // 3) Run Transform Feedback
        shader.use(gl);

        // set uniforms
        shader.setUniform(gl, "uSampleRate", new ShaderUniformValue(this.sampleRate));
        shader.setUniform(gl, "uTimeOffset", new ShaderUniformValue(0.0));

        // discard rasterization (we don't want fragments)
        gl.enable(gl.RASTERIZER_DISCARD);

        gl.beginTransformFeedback(gl.POINTS);
        // // draw N vertices, gl_VertexID supplies index
        gl.drawArrays(gl.POINTS, 0, sampleNums);
        gl.endTransformFeedback();

        gl.disable(gl.RASTERIZER_DISCARD);

        // 4) Read back buffer into Float32Array
        const samples = new Float32Array(sampleNums * 2);
        
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
        gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, samples);

        // 5) Create AudioBuffer from samples
        const audioBuffer = audioContext.createBuffer(2, samples.length, this.sampleRate);
        // audioBuffer.getChannelData(0).set(samples);
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.getChannelData(1);
        for(let i = 0; i < sampleNums; i++){
            left[i] = samples[i * 2 + 0];
            right[i] = samples[i * 2 + 1];
        }

        this.audioBuffer = audioBuffer;

        // cleanup GL bindings (optional)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.useProgram(null);

        // const samples = new Float32Array(num);

        // for(let i = 0; i < num; i++) {
        //     const t = i / this.sampleRate;
        //     samples[i] = Math.sin(2 * TrigonometricConstants.PI_2 * this.frequency * t);
        // }

        // this.audioBuffer = audioContext.createBuffer(1, num, this.sampleRate);
        // this.audioBuffer.getChannelData(0).set(samples);
    }

    getBuffer(): AudioBuffer {
        return this.audioBuffer!;
    }
}