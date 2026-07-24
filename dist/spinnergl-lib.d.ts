interface ApplicationOperation {
    start(): Promise<void>;
    preload(): Promise<void>;
    setup(): void;
    update(): void;
    draw(): void;
}

interface VectorOperation<T> {
    min(other: T, out?: T): T;
    max(other: T, out?: T): T;
    add(other: T, out?: T): T;
    sub(other: T, out?: T): T;
    multiply(other: number, out?: T): T;
    div(other: number, out?: T): T;
    setLength(other: number, out?: T): T;
    limit(other: number, out?: T): T;
    normalize(out?: T): T;
    calcAngle(other: T): number;
    calcDistance(other: T): number;
    dot(other: T): number;
    length(): number;
    lerp(other: T, t: number, out?: T): T;
    clone(): T;
}

declare abstract class Vector<T extends Vector<T>> implements VectorOperation<T> {
    protected components: Float32Array;
    constructor(components: Float32Array);
    get values(): Float32Array;
    get size(): number;
    get(index: number): number;
    abstract min(other: T, out?: T): T;
    abstract max(other: T, out?: T): T;
    abstract add(other: T, out?: T): T;
    abstract sub(other: T, out?: T): T;
    abstract multiply(other: number, out?: T): T;
    abstract div(other: number, out?: T): T;
    abstract setLength(other: number, out?: T): T;
    abstract limit(other: number, out?: T): T;
    abstract normalize(out?: T): T;
    abstract calcDistance(other: T): number;
    abstract calcAngle(other: T): number;
    abstract dot(other: T): number;
    abstract length(): number;
    abstract lerp(other: T, t: number, out?: T): T;
    abstract clone(): T;
}

declare class Vector2 extends Vector<Vector2> {
    constructor(x: number, y: number);
    set x(x: number);
    set y(y: number);
    get x(): number;
    get y(): number;
    create(x?: number, y?: number): Vector2;
    min(other: Vector2, out?: Vector2): Vector2;
    max(other: Vector2, out?: Vector2): Vector2;
    add(other: Vector2, out?: Vector2): Vector2;
    sub(other: Vector2, out?: Vector2): Vector2;
    multiply(other: number, out?: Vector2): Vector2;
    div(other: number, out?: Vector2): Vector2;
    setLength(other: number, out?: Vector2): Vector2;
    limit(other: number, out?: Vector2): Vector2;
    normalize(out?: Vector2): Vector2;
    calcDistance(other: Vector2): number;
    calcAngle(other: Vector2): number;
    dot(other: Vector2): number;
    length(): number;
    lerp(other: Vector2, t: number, out?: Vector2): Vector2;
    clone(): Vector2;
    heading2D(): number;
}

declare const DeviceName: {
    readonly Mouse: "Mouse";
    readonly Keyboard: "Keyboard";
    readonly Midi: "Midi";
};
type DeviceType = (typeof DeviceName)[keyof typeof DeviceName];
declare const MouseButton: {
    readonly LEFT: 0;
    readonly MIDDLE: 1;
    readonly RIGHT: 2;
};
type MouseButtonType = (typeof MouseButton)[keyof typeof MouseButton];
declare const KeyboardCode: {
    readonly A: "KeyA";
    readonly B: "KeyB";
    readonly C: "KeyC";
    readonly D: "KeyD";
    readonly E: "KeyE";
    readonly F: "KeyF";
    readonly G: "KeyG";
    readonly H: "KeyH";
    readonly I: "KeyI";
    readonly J: "KeyJ";
    readonly K: "KeyK";
    readonly L: "KeyL";
    readonly M: "KeyM";
    readonly N: "KeyN";
    readonly O: "KeyO";
    readonly P: "KeyP";
    readonly Q: "KeyQ";
    readonly R: "KeyR";
    readonly S: "KeyS";
    readonly T: "KeyT";
    readonly U: "KeyU";
    readonly V: "KeyV";
    readonly W: "KeyW";
    readonly X: "KeyX";
    readonly Y: "KeyY";
    readonly Z: "KeyZ";
    readonly 0: "D0";
    readonly 1: "D1";
    readonly 2: "D2";
    readonly 3: "D3";
    readonly 4: "D4";
    readonly 5: "D5";
    readonly 6: "D6";
    readonly 7: "D7";
    readonly 8: "D8";
    readonly 9: "D9";
    readonly F1: "F1";
    readonly F2: "F2";
    readonly F3: "F3";
    readonly F4: "F4";
    readonly F5: "F5";
    readonly F6: "F6";
    readonly F7: "F7";
    readonly F8: "F8";
    readonly F9: "F9";
    readonly F10: "F10";
    readonly F11: "F11";
    readonly F12: "F12";
    readonly UP: "ArrowUp";
    readonly DOWN: "ArrowDown";
    readonly LEFT: "ArrowLeft";
    readonly RIGHT: "ArrowRight";
    readonly SPACE: "Space";
};
type KeyboardCodeType = (typeof KeyboardCode)[keyof typeof KeyboardCode];
type InputOption = {
    device: DeviceType;
    type: MouseButtonType | KeyboardCodeType;
};

interface DeviceOperation {
    update(): void;
    isDown(type: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(type: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(type: MouseButtonType | KeyboardCodeType): boolean;
}

declare class InputHub<TDevices extends Record<string, DeviceOperation> = Record<string, DeviceOperation>> {
    private devices;
    constructor();
    update(): void;
    isDown(option: InputOption): boolean;
    isPressed(option: InputOption): boolean;
    isReleased(option: InputOption): boolean;
    getMousePosition(): Vector2;
    getMouseDelta(): Vector2;
    private resolveDevice;
}

interface AudioInputOperation {
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}

declare class AudioOutput {
    private audioContext;
    private audioBuffer;
    private sourceNode;
    private isPlaying;
    private pauseTime;
    private startTime;
    constructor();
    playAudio(offset?: number): void;
    pauseAudio(): void;
    resumeAudio(): void;
    stopAudio(): void;
    setInput(audioInput: AudioInputOperation): void;
    getAudioContext(): AudioContext;
}

declare class ShaderAttribute {
    private location;
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, attributeName: string);
    setAttributeBuffer(gl: WebGL2RenderingContext, size: number, type: number, stride: number, offset: number): void;
}

interface MatrixOperation<T> {
    identity(): T;
    add(other: T, out?: T): T;
    sub(other: T, out?: T): T;
    multiply(other: number, out?: T): T;
    multiply(other: T, out?: T): T;
    div(other: number, out?: T): T;
    transpose(): T;
    inverse(): T;
    clone(): T;
    fillNumber(value: number): void;
}

declare abstract class Matrix<T extends Matrix<T>> implements MatrixOperation<T> {
    protected dimensionNum: number;
    protected data: Float32Array;
    constructor(dimensionNum: number, data?: Float32Array, initializeValue?: number);
    get(rowIndex: number, colIndex: number): number;
    set(rowIndex: number, colIndex: number, value: number): void;
    get col(): number;
    get row(): number;
    get size(): number;
    get elementSize(): number;
    toArray(): Float32Array;
    abstract identity(): T;
    abstract add(other: T, out?: T): T;
    abstract sub(other: T, out?: T): T;
    abstract multiply(other: number, out?: T): T;
    abstract multiply(other: T, out?: T): T;
    abstract div(other: number, out?: T): T;
    abstract transpose(): T;
    abstract inverse(): T;
    abstract clone(): T;
    abstract fillNumber(value: number): void;
}

declare class Matrix22 extends Matrix<Matrix22> {
    constructor(data?: Float32Array);
    identity(): Matrix22;
    add(other: Matrix22, out?: Matrix22): Matrix22;
    sub(other: Matrix22, out?: Matrix22): Matrix22;
    multiply(other: Matrix22, out?: Matrix22): Matrix22;
    multiply(other: number, out?: Matrix22): Matrix22;
    div(other: number, out?: Matrix22): Matrix22;
    transpose(): Matrix22;
    inverse(): Matrix22;
    clone(): Matrix22;
    fillNumber(value: number): void;
}

declare class Quaternion {
    private components;
    constructor(x: number, y: number, z: number, w: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    toMatrix(): Matrix44;
    toEuler(): {
        pitch: number;
        yaw: number;
        roll: number;
    };
}

declare class Vector3 extends Vector<Vector3> {
    constructor(x: number, y: number, z: number);
    set x(x: number);
    set y(y: number);
    set z(z: number);
    get x(): number;
    get y(): number;
    get z(): number;
    create(x?: number, y?: number, z?: number): Vector3;
    min(other: Vector3, out?: Vector3): Vector3;
    max(other: Vector3, out?: Vector3): Vector3;
    add(other: Vector3, out?: Vector3): Vector3;
    sub(other: Vector3, out?: Vector3): Vector3;
    multiply(other: number, out?: Vector3): Vector3;
    div(other: number, out?: Vector3): Vector3;
    setLength(other: number, out?: Vector3): Vector3;
    limit(other: number, out?: Vector3): Vector3;
    normalize(out?: Vector3): Vector3;
    calcDistance(other: Vector3): number;
    calcAngle(other: Vector3): number;
    dot(other: Vector3): number;
    length(): number;
    lerp(other: Vector3, t: number, out?: Vector3): Vector3;
    clone(): Vector3;
    cross(other: Vector3, out?: Vector3): Vector3;
    heading3D(): [elevation: number, azimuth: number];
}

declare class Matrix44 extends Matrix<Matrix44> {
    constructor(data?: Float32Array);
    identity(): Matrix44;
    add(other: Matrix44, out?: Matrix44): Matrix44;
    sub(other: Matrix44, out?: Matrix44): Matrix44;
    multiply(other: Matrix44, out?: Matrix44): Matrix44;
    multiply(other: number, out?: Matrix44): Matrix44;
    div(other: number, out?: Matrix44): Matrix44;
    transpose(): Matrix44;
    inverse(): Matrix44;
    clone(): Matrix44;
    fillNumber(value: number): void;
    orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, out?: Matrix44): Matrix44;
    perspective(fovDegrees: number, width: number, height: number, near: number, far: number, out?: Matrix44): Matrix44;
    lookAt(eyePos: Vector3, targetPos: Vector3, up: Vector3, out?: Matrix44): Matrix44;
    translate2D(offset: Vector2, out?: Matrix44): Matrix44;
    translate3D(offset: Vector3, out?: Matrix44): Matrix44;
    rotateX(angle: number, out?: Matrix44): Matrix44;
    rotateY(angle: number, out?: Matrix44): Matrix44;
    rotateZ(angle: number, out?: Matrix44): Matrix44;
    rotate2D(angle: number, out?: Matrix44): Matrix44;
    rotate3D(angle: number, axis: Vector3, out?: Matrix44): Matrix44;
    rotateByQuaternion(rotation: Quaternion, out?: Matrix44): Matrix44;
    scale2D(scaleX: number, scaleY: number, out?: Matrix44): Matrix44;
    scale3D(scaleX: number, scaleY: number, scaleZ: number, out?: Matrix44): Matrix44;
    private createRotateMatrix3D;
    private createScaleMatrix2D;
    private createScaleMatrix3D;
}

declare class Matrix33 extends Matrix<Matrix33> {
    constructor(data?: Float32Array);
    identity(): Matrix33;
    add(other: Matrix33, out?: Matrix33): Matrix33;
    sub(other: Matrix33, out?: Matrix33): Matrix33;
    multiply(other: Matrix33, out?: Matrix33): Matrix33;
    multiply(other: number, out?: Matrix33): Matrix33;
    div(other: number, out?: Matrix33): Matrix33;
    transpose(): Matrix33;
    inverse(): Matrix33;
    clone(): Matrix33;
    fillNumber(value: number): void;
    normalMatrix(modelMatrix: Matrix44): Matrix33;
}

declare class Vector4 extends Vector<Vector4> {
    constructor(x: number, y: number, z: number, w: number);
    set x(x: number);
    set y(y: number);
    set z(z: number);
    set w(w: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    create(x?: number, y?: number, z?: number, w?: number): Vector4;
    min(other: Vector4, out?: Vector4): Vector4;
    max(other: Vector4, out?: Vector4): Vector4;
    add(other: Vector4, out?: Vector4): Vector4;
    sub(other: Vector4, out?: Vector4): Vector4;
    multiply(other: number, out?: Vector4): Vector4;
    div(other: number, out?: Vector4): Vector4;
    setLength(other: number, out?: Vector4): Vector4;
    limit(other: number, out?: Vector4): Vector4;
    normalize(out?: Vector4): Vector4;
    calcDistance(other: Vector4): number;
    calcAngle(other: Vector4): number;
    dot(other: Vector4): number;
    length(): number;
    lerp(other: Vector4, t: number, out?: Vector4): Vector4;
    clone(): Vector4;
}

declare class ShaderUniformValue {
    private values;
    private type;
    private byteSize;
    constructor(value: UniformAvailableType, type?: UniformValueType);
    getUniformValues(): number | number[] | Float32Array | Int32Array;
    getUniformType(): UniformType;
    getByteSize(): number;
    private getValue;
    private getType;
    private calculateByteSize;
    private isFloat;
}

type UniformType = '1f' | '1fv' | '1i' | '1iv' | '2f' | '2fv' | '2i' | '2iv' | '3f' | '3fv' | '3i' | '3iv' | '4f' | '4fv' | '4i' | '4iv' | 'Matrix2fv' | 'Matrix3fv' | 'Matrix4fv';
type UniformAvailableType = number | number[] | Float32Array | Int32Array | Matrix22 | Matrix33 | Matrix44 | Vector2 | Vector3 | Vector4;
type UniformValueType = 'float' | 'int';
type UniformPairs = Record<string, ShaderUniformValue>;
declare const NumberByte = 4;
declare const UniformBindingPoint: {
    readonly GLOBAL: 0;
    readonly MATERIAL: 1;
    readonly OBJECT: 2;
    readonly LIGHT: 3;
    readonly DEBUG: 10;
};
type UniformBindingPointKey = (typeof UniformBindingPoint)[keyof typeof UniformBindingPoint];
declare const GlobalUniformKey: {
    readonly VIEW_MATRIX: "viewMatrix";
    readonly PROJECTION_MATRIX: "projectionMatrix";
    readonly TIME: "time";
    readonly RESOLUTION: "resolution";
    readonly MOUSE: "mouse";
};
type GlobalUniformKeyValue = (typeof GlobalUniformKey)[keyof typeof GlobalUniformKey];

declare class ShaderUniform {
    private gl;
    private location;
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram, uniformName: string);
    setUniform(value: number | number[] | Float32Array | Int32Array, type: UniformType): void;
}

declare class ShaderProgram {
    private program;
    private vertexShader;
    private fragmentShader;
    private attributes;
    private uniforms;
    private varyings;
    constructor(gl: WebGL2RenderingContext, vertShaderSource: string, fragShaderSource: string, varyings?: string[]);
    use(gl: WebGL2RenderingContext): void;
    getProgram(): WebGLProgram;
    getFragmentShader(): WebGLShader;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    getUniform(gl: WebGL2RenderingContext, name: string): ShaderUniform;
    setUniform(gl: WebGL2RenderingContext, name: string, value: ShaderUniformValue): void;
    private createProgram;
    private compileShader;
    private createShader;
}

type CameraOptions = {
    position?: Vector3;
    rotation?: Quaternion;
    near?: number;
    far?: number;
    fov?: number;
    viewportWidth?: number;
    viewportHeight?: number;
};
type CameraDirection = {
    up?: Vector3;
    forward?: Vector3;
};
declare const CameraType: {
    Perspective: number;
    Orthography: number;
};

declare class Camera {
    private cameraType;
    private viewMatrix;
    private projectionMatrix;
    private position;
    private rotation;
    private near;
    private far;
    private fov;
    private viewportWidth;
    private viewportHeight;
    private up;
    private forward;
    constructor(cameraType?: number, options?: CameraOptions, direction?: CameraDirection);
    setPosition(position: Vector3): void;
    setRotation(rotation: Quaternion): void;
    setViewport(width: number, height: number): void;
    setCameraType(type: number): void;
    getViewMatrix(): Matrix44;
    getProjectionMatrix(): Matrix44;
    calculateEyeDirection(): Vector3;
    private calculateViewMatrix;
    private calculateProjectionMatrix;
    private calculatePerspectiveMatrix;
    private calculateOrthographicMatrix;
}

declare class Color255 {
    private r;
    private g;
    private b;
    private a;
    constructor(r: number, g: number, b: number, a?: number);
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    translateTo01(): Color;
    translateToColorCode(): string;
}

declare class Color {
    private r;
    private g;
    private b;
    private a;
    constructor(r: number, g: number, b: number, a?: number);
    static empty(): Color;
    static isEmpty(color: Color): boolean;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    get toRGBArray(): Float32Array;
    get toRGBAArray(): Float32Array;
    getRgbToVector3(): Vector3;
    toVector4(): Vector4;
    translateTo255(): Color255;
}

declare const LightType: {
    readonly Directional: 1;
    readonly Point: 2;
};
type BaseLightParams = {
    lightType: number;
    color: Color;
    intensity: number;
};
type DirectionalLightParams = BaseLightParams & {
    direction: Vector3;
};
type PointLightParams = BaseLightParams & {
    position: Vector3;
};
type LightParams = DirectionalLightParams | PointLightParams;

interface RenderTargetOperation {
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
}

declare class PingPongRenderTarget {
    private targets;
    private readIndex;
    constructor(targetA: RenderTargetOperation, targetB: RenderTargetOperation);
    get read(): RenderTargetOperation;
    get write(): RenderTargetOperation;
    swap(): void;
    resize(resolution: [number, number]): void;
    dispose(): void;
    getColorTexture(index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
}

declare const RenderTargetSlot: {
    readonly CURRENT_FRAME: 0;
    readonly TEMP_FRAME_BUFFER: 1;
    readonly PREV_FRAME: 2;
    readonly HALF_RES_BUFFER: 3;
    readonly BRIGHT_PASS_BUFFER: 4;
    readonly BLOOM_RENDER_TARGET: 5;
    readonly PINGPONG_TEMP_BUFFER: 100;
};
type RenderTargetSlotKey = (typeof RenderTargetSlot)[keyof typeof RenderTargetSlot];

declare class ScreenRenderTarget implements RenderTargetOperation {
    private gl;
    private width;
    private height;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number]);
    bindAsDrawTarget(): void;
    getColorTexture(_index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getFrameBuffer(): WebGLFramebuffer;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
}

interface RenderTargetRegistryOperation {
    getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined;
    addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void;
    getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined;
    addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget): void;
    getScreenRenderTarget(): ScreenRenderTarget;
    setScreenRenderTarget(screenRenderTarget: ScreenRenderTarget): void;
    dispose(): void;
}

declare const RenderTagConstants: {
    readonly BACKGROUND: 0;
    readonly OPAQUE: 1;
    readonly EMISSIVE: 2;
    readonly TRANSPARENT: 3;
    readonly DISTORTION: 4;
    readonly OVERLAY: 5;
    readonly ALL: -1;
};
type RenderTag = (typeof RenderTagConstants)[keyof typeof RenderTagConstants];

declare class RendererContext {
    private camera;
    private lights;
    private globalUniforms;
    private fragmentCanvasUniforms;
    private currentShaderProgram;
    private renderTargetRegistry;
    private activateRenderTag;
    private globalUniformBuffer;
    constructor(gl: WebGL2RenderingContext);
    getRenderTargetRegistry(): RenderTargetRegistryOperation;
    setActivateRenderTag(renderTag: RenderTag): void;
    getActivateRenderTag(): RenderTag;
    setCamera(camera: Camera): void;
    getCamera(): Camera;
    updateGlobalUniform(key: string, value: ShaderUniformValue): void;
    getGlobalUniform(): UniformPairs;
    updateGlobalUniformValues(time: number, mousePos: Vector2): void;
    bindGlobalUniforms(): void;
    updateFragmentCanvasUniform(key: string, value: ShaderUniformValue): void;
    getFragmentCanvasUniform(): UniformPairs;
    setCurrentShaderProgram(program: ShaderProgram): void;
    isCurrentShaderProgramSame(program: ShaderProgram): boolean;
    setLights(lights: LightParams[]): void;
    getLights(): LightParams[];
}

declare class Transform {
    private position;
    private scale;
    private rotation;
    private localMatrix;
    private worldMatrix;
    private isRequiredRecalculation;
    constructor();
    updateMatrix(parentMatrix?: Matrix44 | undefined): void;
    getWorldMatrix(): Matrix44;
    setPosition(position: Vector3): void;
    setScale(scale: Vector3): void;
    setRotation(rotation: Quaternion): void;
    getWorldPosition(): Vector3;
    private calculateLocalMatrix;
    private calculateWorldMatrix;
}

declare abstract class SceneNode {
    protected id: string;
    protected parent: SceneNode | undefined;
    protected children: SceneNode[];
    protected transform: Transform;
    protected renderTag: RenderTag;
    constructor(id?: string);
    addChild(child: SceneNode): void;
    removeChild(child: SceneNode): void;
    getChildren(): SceneNode[];
    getId(): string;
    getTransform(): Transform;
    shouldDraw(rendererContext: RendererContext): boolean;
    private setParent;
    abstract update(): void;
    abstract draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class SceneGraph {
    private readonly root;
    constructor();
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    getGraph(): SceneNode;
}

interface ClockOperation {
    update(): void;
    setTimeScale(timeScale: number): void;
    setFps(fps: number): void;
    setFrameInterval(fps: number): void;
    setFrameNum(frame: number): void;
    shouldDraw(): boolean;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    getFrameInterval(): number;
    reset(): void;
}

interface SceneOperation {
    start(): void;
    stop(): void;
    reset(): void;
    getClock(): ClockOperation;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
}

interface ShaderPassOperation {
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}

interface RendererFlowOperation {
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}

declare abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    abstract isEnabled(): boolean;
}

declare class FinalBlitRendererFlow extends BaseSceneRendererFlow {
    private finalBlitShaderPass;
    constructor(shaderPass: ShaderPassOperation);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}

declare class PostEffectRendererFlow extends BaseSceneRendererFlow {
    private shaderPass;
    constructor(shaderPass: ShaderPassOperation);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}

interface SceneRendererPipelineOperation {
    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void;
    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void;
    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
}

interface TextureOperation {
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
}

declare class Texture2D implements TextureOperation {
    private gl;
    private texture;
    private image;
    constructor(gl: WebGL2RenderingContext, source: string);
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
    private setUpTexture;
}

interface FontGlyphData {
    id: number;
    index: number;
    char: string;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    chnl: number;
    x: number;
    y: number;
    page: number;
}
declare class FontGlyph {
    private char;
    private uv;
    private resolution;
    private offset;
    private xAdvance;
    constructor(data: FontGlyphData, textureWidth: number, textureHeight: number);
    getChar(): string;
    getUv(): {
        u0: number;
        v0: number;
        u1: number;
        v1: number;
    };
    getResolution(): [number, number];
    getOffset(): [number, number];
    getXAdvance(): number;
}

interface FontGlyphJsonData {
    pages: string[];
    chars: FontGlyphData[];
}
declare class TextFontLoader {
    private gl;
    private sdfFontTextureCache;
    private sdfFontGlyphCache;
    private currentUseFontName;
    constructor(gl: WebGL2RenderingContext);
    setCurrentUseFontName(fontName: string): void;
    getTextureForCurrentFont(): Texture2D;
    getGlyphsFromText(text: string): Array<FontGlyph>;
    loadTextFontFromPathAndJsonText(textureKey: string, sdfFontTexturePath: string, sdfFontTextureReferenceJsonData: FontGlyphJsonData): void;
    loadTextFontFromPath(sdfFontTexturePath: string, sdfFontTextureReferenceJsonPath: string): Promise<void>;
}

declare class ShaderLoader {
    private gl;
    private shaderProgramCache;
    private shaderProgramKey;
    constructor(gl: WebGL2RenderingContext);
    getShaderProgram(key: string): ShaderProgram;
    loadShaderFromPath(vertShaderPath: string, fragShaderPath: string, varyings?: string[]): Promise<void>;
    loadShaderFromSource(shaderKey: string, vertShaderSource: string, fragShaderSource: string, varyings?: string[]): Promise<void>;
    loadCommonShaders(): Promise<void>;
    loadShader(path: string): Promise<string>;
}

declare class TextureLoader {
    private gl;
    private textureCache;
    private textureKeySet;
    constructor(gl: WebGL2RenderingContext);
    getTexture(key: string): Texture2D;
    loadTextureFromPath(texturePath: string): Promise<void>;
}

declare class WebGLUtility {
    private gl;
    constructor(canvas: HTMLCanvasElement);
    getWebGL2RenderingContext(): WebGL2RenderingContext;
    clearColor(color: Color): void;
    resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean;
    setViewport(canvas: HTMLCanvasElement): void;
    private initializeWebGL2RenderingContext;
}

declare abstract class BaseApplication implements ApplicationOperation {
    protected canvas: HTMLCanvasElement;
    protected webglUtility: WebGLUtility;
    protected gl: WebGL2RenderingContext;
    protected shaderLoader: ShaderLoader;
    protected textureLoader: TextureLoader;
    protected textFontLoader: TextFontLoader;
    protected scene: SceneOperation;
    protected sceneGraph: SceneGraph;
    protected rendererContext: RendererContext;
    protected audioOutput: AudioOutput;
    protected rendererFlowPipeline: SceneRendererPipelineOperation;
    protected inputHub: InputHub;
    constructor(scene: SceneOperation);
    start(): Promise<void>;
    preload(): Promise<void>;
    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}

declare class RecordScene implements SceneOperation {
    private clock;
    private isRunning;
    private updateFunction;
    private drawFunction;
    private additionalSupportFunctionAsync;
    private animationId;
    constructor();
    start(): void;
    stop(): void;
    reset(): void;
    getClock(): ClockOperation;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
    get Clock(): ClockOperation;
    record(fps: number, frameNum: number): Promise<void>;
    private updateObjects;
    private drawObjects;
    private additionalSupport;
    private delay;
}

type RecordType = 'Frame' | 'SequencialFrames' | 'StartAndStop';
type RecordOptions = {
    type: RecordType;
    fps: number;
    fixedFrameInterval: number;
    resolution: [number, number];
    saveName: string;
    frameNum?: number;
};
declare class Recorder {
    private canvas;
    private options;
    private frames;
    private currentFrameCount;
    constructor(canvas: HTMLCanvasElement);
    resetRecord(): void;
    setOptions(options: RecordOptions): void;
    saveSequentialFrames(): Promise<void>;
    saveFrameWithName(name: string): Promise<void>;
    endRecordingAuto(): boolean;
    saveFramesAsZip(zipName?: string): Promise<void>;
    private save;
}

type ClockType = 'RealTime' | 'Fixed';

declare abstract class RecordingApplication extends BaseApplication {
    protected recorder: Recorder;
    private isRecording;
    constructor(scene: RecordScene);
    start(): Promise<void>;
    startRecording(): void;
    endRecording(): void;
    changeSceneClock(clockType: ClockType): void;
    preload(): Promise<void>;
    additionalSupport(): Promise<void>;
    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}

declare const DefaultColorConstants: {
    RED: Color;
    GREEN: Color;
    BLUE: Color;
    WHITE: Color;
    BLACK: Color;
};
declare const MyColorConstants255: {
    COLOR_EMPTY: Color255;
    COLOR_SUBARU: Color255;
    COLOR_NOCTCHILL: Color255;
    COLOR_TORU: Color255;
    COLOR_MADOKA: Color255;
    COLOR_KOITO: Color255;
    COLOR_HINANA: Color255;
    COLOR_HARUKI: Color255;
    COLOR_CHINA: Color255;
    COLOR_SENA: Color255;
    COLOR_LILJA: Color255;
    COLOR_SUMIKA: Color255;
};
declare const MyColorCode: {
    COLOR_EMPTY: string;
    COLOR_SUBARU: string;
    COLOR_NOCTCHILL: string;
    COLOR_TORU: string;
    COLOR_MADOKA: string;
    COLOR_KOITO: string;
    COLOR_HINANA: string;
    COLOR_HARUKI: string;
    COLOR_CHINA: string;
    COLOR_SENA: string;
    COLOR_LILJA: string;
    COLOR_SUMIKA: string;
};

declare class ColorUtility {
    static hexToColor255(colorCode: string): Color255;
    static hexToColor01(colorCode: string): Color;
    static hsvToRgb(hue: number, saturation: number, value: number, alpha: number): Color;
}

declare const DefaultVectorConstants: {
    AXIS2DX: Vector3;
    AXIS2DY: Vector3;
    AXIS2DZ: Vector3;
};
declare const VectorClassAndSizePair: Record<number, new (...args: number[]) => Vector<any>>;

declare const MatrixClassAndSizePair: Record<number, {
    new (): Matrix<any>;
}>;

declare class MathUtility {
    static degreesToRadians(degrees: number): number;
    static radiansToDegrees(radians: number): number;
    static clamp(inputValue: number, minValue: number, maxValue: number): number;
    static saturate(inputValue: number): number;
    static sin(angle: number): number;
    static cos(angle: number): number;
    static tan(angle: number): number;
    static exp(value: number): number;
    static acos(angle: number): number;
    static atan2(y: number, x: number): number;
    static fract(value: number): number;
    static ceil(value: number): number;
    static linearStep(start: number, end: number, t: number): number;
    static timeToBeat(time: number, bpm: number): number;
    static beatToTime(beat: number, bpm: number): number;
    static calculateGaussianCoefficients(range: number, count: number): Float32Array;
    private static roundToZero;
}

declare class MatrixCalculator {
    static identity22(): Matrix22;
    static identity33(): Matrix33;
    static identity44(): Matrix44;
    static add<T extends Matrix<T>>(a: T, b: T): T;
    static sub<T extends Matrix<T>>(a: T, b: T): T;
    static multiply<T extends Matrix<T>>(a: T, b: T): T;
    static multiply<T extends Matrix<T>>(a: T, b: number): T;
    static div<T extends Matrix<T>>(a: T, b: number): T;
    static translate2D(target: Matrix44, offset: Vector2): Matrix44;
    static translate3D(target: Matrix44, offset: Vector3): Matrix44;
    static rotate2D(target: Matrix44, angle: number): Matrix44;
    static rotate3D(target: Matrix44, angle: number, axis: Vector3): Matrix44;
    static rotateByQuaternion(target: Matrix44, rotation: Quaternion): Matrix44;
    static scale2D(target: Matrix44, scaleX: number, scaleY: number): Matrix44;
    static scale3D(target: Matrix44, scaleX: number, scaleY: number, scaleZ: number): Matrix44;
    static transpose<T extends Matrix<T>>(baseMatrix: T): T;
    static inverse<T extends Matrix<T>>(baseMatrix: T): T;
    static orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): Matrix44;
    static perspective(fovDegrees: number, width: number, height: number, near: number, far: number): Matrix44;
    static lookAt(eyePos: Vector3, targetPos: Vector3, up: Vector3): Matrix44;
    private static checkSizeEqual;
    private static createMatrixInstance;
}

declare class VectorCalculator {
    static min<T extends Vector<T>>(a: T, b: T): T;
    static max<T extends Vector<T>>(a: T, b: T): T;
    static add<T extends Vector<T>>(a: T, b: T): T;
    static sub<T extends Vector<T>>(a: T, b: T): T;
    static calcDistance<T extends Vector<T>>(a: T, b: T): number;
    static calcAngle<T extends Vector<T>>(a: T, b: T): number;
    static dot<T extends Vector<T>>(a: T, b: T): number;
    static multiply<T extends Vector<T>>(a: T, b: number): T;
    static divide<T extends Vector<T>>(a: T, b: number): T;
    static limit<T extends Vector<T>>(a: T, b: number): T;
    static setLength<T extends Vector<T>>(a: T, b: number): T;
    static normalize<T extends Vector<T>>(vector: T): T;
    static length<T extends Vector<T>>(vector: T): number;
    static lerp<T extends Vector<T>>(min: T, max: T, t: number): T;
    static cross(a: Vector3, b: Vector3): Vector3;
    static heading2D(vector: Vector2): number;
    static heading3D(vector: Vector3): [elevation: number, azimuth: number];
    private static convertVector;
}

declare class QuaternionCalculator {
    static create(x: number, y: number, z: number, w: number): Quaternion;
    static createFromEuler(roll: number, pitch: number, yaw: number): Quaternion;
    static createFromAxisAndRadians(axis: Vector3, radians: number): Quaternion;
    static identity(): Quaternion;
    static add(a: Quaternion, b: Quaternion): Quaternion;
    static sub(a: Quaternion, b: Quaternion): Quaternion;
    static multiply(a: Quaternion, b: Quaternion): Quaternion;
    static scale(a: Quaternion, s: number): Quaternion;
    static dot(a: Quaternion, b: Quaternion): number;
    static conjugate(q: Quaternion): Quaternion;
    static normalize(q: Quaternion): Quaternion;
    static inverse(q: Quaternion): Quaternion;
    static rotateVector(q: Quaternion, v: Vector3): Vector3;
    static rotateVector(q: Quaternion, v: Vector4): Vector3;
    static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
    private static toQuaternion;
}

declare const DefaultValueConstants: {
    EPSILON: number;
};
declare const TrigonometricConstants: {
    PI: number;
    PI_2: number;
    RAD_TO_DEG: number;
    DEG_TO_RAD: number;
};

declare const AttributeElementSize: {
    aPosition: number;
    aColor: number;
    aUv: number;
    aNormal: number;
};

interface BufferOperation {
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
}

declare abstract class BaseBuffer implements BufferOperation {
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null;
    constructor(gl: WebGL2RenderingContext);
    get BufferType(): number;
    abstract bind(): void;
    abstract unbind(): void;
    abstract setData(): void;
    abstract dispose(): void;
}

declare class VertexArray {
    private gl;
    private vao;
    private buffers;
    constructor(gl: WebGL2RenderingContext);
    addBuffer(keyName: string, buffer: BaseBuffer): void;
    bindVao(): void;
    bind(): void;
    unbind(): void;
    unbindVao(): void;
    dispose(): void;
}

declare class GeometryBuffer extends BaseBuffer {
    private interleavedArray;
    constructor(gl: WebGL2RenderingContext, vertices: Float32Array, color: Float32Array, normal: Float32Array, uv?: Float32Array);
    get BufferType(): number;
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
    createInterleavedArray(vertices: Float32Array, color: Float32Array, normal: Float32Array, uv: Float32Array): Float32Array;
}

declare class IndexBuffer extends BaseBuffer {
    private indices;
    constructor(gl: WebGL2RenderingContext, indices: Int16Array);
    get BufferType(): number;
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
}

declare class ShaderUniformBuffer extends BaseBuffer {
    private cpuBuffer;
    private memberOffsets;
    private shouldTransfer;
    constructor(gl: WebGL2RenderingContext, uniforms: UniformPairs);
    get BufferType(): number;
    bind(slot?: number): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
    updateUniformValue(key: string, value: ShaderUniformValue): void;
    transferUniform(): void;
    private initialize;
}

interface GeometryOperation {
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    bind(): void;
    unbind(): void;
    getIndexCount(): number;
    dispose(): void;
}

declare abstract class BaseGeometry implements GeometryOperation {
    protected vao: VertexArray;
    protected vertices: Float32Array;
    protected color: Float32Array;
    protected normal: Float32Array;
    protected indices: Int16Array;
    constructor(gl: WebGL2RenderingContext);
    abstract setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    bind(): void;
    unbind(): void;
    getIndexCount(): number;
    dispose(): void;
}

declare class Rectangle extends BaseGeometry {
    protected uv: Float32Array;
    constructor(gl: WebGL2RenderingContext, width?: number, height?: number);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}

declare class Plane extends BaseGeometry {
    protected uv: Float32Array;
    constructor(gl: WebGL2RenderingContext, width?: number, height?: number, color?: Color);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}

declare class Torus extends BaseGeometry {
    constructor(gl: WebGL2RenderingContext, row: number, column: number, inRadius: number, outRadius: number, color?: Color);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}

declare class Sphere extends BaseGeometry {
    constructor(gl: WebGL2RenderingContext, row: number, column: number, radius: number, color?: Color);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
}

declare class TextQuad extends BaseGeometry {
    protected uv: Float32Array;
    private width;
    private height;
    constructor(gl: WebGL2RenderingContext, text: Array<FontGlyph>, textTexture: Texture2D);
    setUpBuffers(gl: WebGL2RenderingContext, attributes: Record<string, ShaderAttribute>): void;
    get resolution(): [number, number];
}

declare class TextureFrameBuffer implements TextureOperation {
    private gl;
    private texture;
    constructor(gl: WebGL2RenderingContext, texture: WebGLTexture);
    bind(index: number): void;
    unbind(): void;
    getTextureSize(): {
        width: number;
        height: number;
    };
}

declare const TextureSlot: {
    CURRENT_FRAME: number;
    PREV_FRAME: number;
    FONT_ATLAS: number;
    BLOOM_FRAME: number;
    POST_EFFECTED: number;
};

declare enum AttachmentType {
    COLOR = 0,
    ID = 1,
    NORMAL = 2,
    EMISSIVE = 3,
    DEPTH = 4,
    DEPTH_TEXTURE = 5,
    STENCIL = 6,
    DEPTH_STENCIL = 7
}
type AttachmentConfig = {
    type: AttachmentType;
    minFilter?: number;
    magFilter?: number;
};
type CustomRenderTargetOption = {
    attachments: AttachmentConfig[];
};
type RenderTargetOption = {
    colorTextureCount?: number;
    useDepth?: boolean;
};

declare class CustomRenderTarget implements RenderTargetOperation {
    private gl;
    private framebuffer;
    private colorTextures;
    private depthTexture;
    private depthRenderbuffer;
    private width;
    private height;
    private option;
    private colorTextureCount;
    private drawBufferAttachmentPoints;
    constructor(gl: WebGL2RenderingContext, resolution: [number, number], option?: CustomRenderTargetOption);
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index?: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
    private initialize;
    private setUpAttachment;
    private getColorTextureSettingByAttachmentType;
    private getRenderbufferSettingByAttachmentType;
    private getTextureFilters;
}

declare class ExternalFileAudioInput implements AudioInputOperation {
    private audioBuffer;
    constructor();
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}

declare class ShaderAudioInput implements AudioInputOperation {
    private audioBuffer;
    private gl;
    private shaderLoader;
    private sampleRate;
    private duration;
    constructor(gl: WebGL2RenderingContext, shaderLoader: ShaderLoader, audioDuration?: number);
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
    saveToWav(): void;
}

declare abstract class Clock implements ClockOperation {
    protected startTime: number;
    protected elapsedTime: number;
    protected timeScale: number;
    protected frameCount: number;
    protected deltaTime: number;
    protected lastDrawCallTime: number;
    protected fps: number;
    protected frameInterval: number;
    constructor();
    setFps(fps: number): void;
    setFrameInterval(fps: number): void;
    setTimeScale(timeScale: number): void;
    setFrameNum(frame: number): void;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    getFrameInterval(): number;
    reset(): void;
    abstract update(): void;
    abstract shouldDraw(): boolean;
}

declare class FixedTimeClock extends Clock {
    constructor();
    update(): void;
    shouldDraw(): boolean;
    reset(): void;
}

declare class RealTimeClock extends Clock {
    private lastTime;
    constructor();
    update(): void;
    shouldDraw(): boolean;
    reset(): void;
}

interface MaterialOperation {
    use(gl: WebGL2RenderingContext, context: RendererContext): void;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    cleanup(): void;
}

declare abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;
    constructor(shaderProgram: ShaderProgram);
    use(gl: WebGL2RenderingContext, context: RendererContext): void;
    getAttribute(gl: WebGL2RenderingContext, name: string): ShaderAttribute;
    cleanup(): void;
    abstract setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class FragmentCanvasMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class UnlitMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class GouraudMaterial extends BaseMaterial {
    private lightDirection;
    private eyeDirection;
    private ambientColor;
    constructor(shaderProgram: ShaderProgram, lightDirection: Vector3, eyeDirection: Vector3, ambientColor: Color);
    setLightDirection(lightDirection: Vector3): void;
    setEyeDirection(eyeDirection: Vector3): void;
    setAmbientColor(ambientColor: Color): void;
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class PhongMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void;
}

declare class TexturedMaterial extends BaseMaterial {
    private texture;
    private texIndex;
    constructor(shaderProgram: ShaderProgram, texture: Texture2D, index: number);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    cleanup(): void;
}

declare class FrameBufferTexturedMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class GrayScaleMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class MosaicMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class RGBShiftMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class GlitchMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class BlurMaterial extends BaseMaterial {
    private isVertical;
    private blurCoefficients;
    constructor(shaderProgram: ShaderProgram, isVertical: boolean, blueRange?: number);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class BrightMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class ComposeMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class MaskMaterial extends BaseMaterial {
    constructor(shaderProgram: ShaderProgram);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
}

interface MeshOperation {
    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void;
    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void;
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}

declare abstract class BaseMesh implements MeshOperation {
    protected geometry: GeometryOperation;
    protected material: MaterialOperation;
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    useMaterial(gl: WebGL2RenderingContext, context: RendererContext): void;
    updateMaterialParams(_gl: WebGL2RenderingContext, _transform: Transform, _context: RendererContext): void;
    abstract updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    abstract draw(gl: WebGL2RenderingContext): void;
}

declare class FullScreenQuadMesh extends BaseMesh {
    constructor(geometry: Rectangle, material: MaterialOperation);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}

declare class SimpleMesh extends BaseMesh {
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    updateMaterialParams(gl: WebGL2RenderingContext, transform: Transform, context: RendererContext): void;
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}

declare class UnlitMesh extends BaseMesh {
    constructor(geometry: GeometryOperation, material: MaterialOperation);
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}

declare class TextMesh extends BaseMesh {
    constructor(geometry: TextQuad, material: MaterialOperation);
    get resolution(): [number, number];
    updateUniforms(gl: WebGL2RenderingContext, context: RendererContext): void;
    draw(gl: WebGL2RenderingContext): void;
}

declare class TexturedTextMaterial extends BaseMaterial {
    private fontTexture;
    private smoothness;
    private fontColor;
    constructor(shaderProgram: ShaderProgram, fontTexture: Texture2D, smoothness: number, fontColor: Float32Array);
    setUniform(gl: WebGL2RenderingContext, context: RendererContext): void;
    cleanup(): void;
}

declare class MaterialFactory {
    private static shaderLoader;
    private static textureLoader;
    private static textFontLoader;
    static init(shaderLoader: ShaderLoader, textureLoader: TextureLoader, textFontLoader: TextFontLoader): void;
    static fragmentCanvasMaterial(programKey: string): FragmentCanvasMaterial;
    static texturedMaterial(textureKey: string, texIndex: number): TexturedMaterial;
    static texturedTextMaterial(smoothness: number, fontColorHex: string): TexturedTextMaterial;
    static customTexturedTextMaterial(shaderKey: string, smoothness: number, fontColorHex: string): TexturedTextMaterial;
    static frameBufferTextureMaterial(): FrameBufferTexturedMaterial;
    static grayScaleMaterial(): GrayScaleMaterial;
    static singleDirectionBlurMaterial(isVertical: boolean, blurRange: number): BlurMaterial;
    static brightMaterial(): BrightMaterial;
    static maskMaterial(shaderKey: string): MaskMaterial;
    static composeMaterial(): ComposeMaterial;
    static mosaicMaterial(): MosaicMaterial;
    static rgbShiftMaterial(shaderKey?: string): MosaicMaterial;
    static glitchMaterial(shaderKey?: string): GlitchMaterial;
    static unlitMaterial(): UnlitMaterial;
    static phongMaterial(): PhongMaterial;
    static gouraudMaterial(lightDirection?: Vector3, eyeDirection?: Vector3, ambientColor?: Color): GouraudMaterial;
}

interface LightOperation {
    setColor(color: Color): void;
    setIntensity(intensity: number): void;
    getColor(): Color;
    getIntensity(): number;
}

declare class Light implements LightOperation {
    private color;
    private intensity;
    constructor(color: Color, intensity: number);
    setColor(color: Color): void;
    setIntensity(intensity: number): void;
    getColor(): Color;
    getIntensity(): number;
}

declare class Scene implements SceneOperation {
    private clock;
    private isRunning;
    private updateFunction;
    private drawFunction;
    private additionalSupportFunctionAsync;
    private animationId;
    constructor();
    start(): void;
    stop(): void;
    reset(): void;
    getClock(): ClockOperation;
    setUpdate(updateFunction: Function): void;
    setDraw(drawFunction: Function): void;
    setAdditionalSupport(additionalSupport: Function): void;
    setRealTimeClock(fps: number): void;
    setFixedTimeClock(fps: number, frameInterval: number): void;
    get Clock(): ClockOperation;
    private run;
    private updateObjects;
    private drawObjects;
    private additionalSupport;
}

declare class SceneGraphUtility {
    static replaceNode(root: SceneNode, target: SceneNode, newNode: SceneNode, isTakeOver?: boolean): void;
    static addChild(target: SceneNode, newNode: SceneNode): void;
    static findNodeById(root: SceneNode, id: string): SceneNode | undefined;
    static traverse(root: SceneNode, callback: (node: SceneNode) => void): void;
}

declare class SceneGraphNodeIdGenerator {
    private static counters;
    static generateId(className: string): string;
}

declare class EmptyNode extends SceneNode {
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class GroupNode extends SceneNode {
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class MeshNode extends SceneNode {
    private mesh;
    constructor(mesh: BaseMesh, id?: string);
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    private updateUniforms;
    private updateMaterialParams;
}

declare abstract class LightNode extends SceneNode {
    protected light: Light;
    constructor(light: Light);
    abstract getLightData(): LightParams;
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}

declare class PointLightNode extends LightNode {
    constructor(light: Light);
    getLightData(): PointLightParams;
}

declare class DirectionalLightNode extends LightNode {
    private lightDirection;
    constructor(light: Light, lightDirection?: Vector3);
    setLightDirection(lightDirection: Vector3): void;
    getLightData(): DirectionalLightParams;
}

declare class TextMeshNode extends SceneNode {
    private mesh;
    constructor(mesh: TextMesh, id?: string);
    update(): void;
    draw(gl: WebGL2RenderingContext, context: RendererContext): void;
    private updateUniforms;
    private updateMaterialParams;
}

declare class StandardSceneRendererFlow extends BaseSceneRendererFlow {
    private sceneGraphRoot;
    constructor(sceneGraphRoot: EmptyNode);
    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    isEnabled(): boolean;
}

type RendererFlowOptions = {
    useFbo: boolean;
    gl?: WebGL2RenderingContext;
    resolution?: [number, number];
};

declare class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private sceneRendererFlows;
    private postEffectFlows;
    private finalBlitFlow;
    constructor();
    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void;
    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void;
    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void;
    render(gl: WebGL2RenderingContext, context: RendererContext): void;
    private renderScene;
}

declare abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: MeshNode;
    protected isEffectEnabled: boolean;
    constructor(gl: WebGL2RenderingContext, material: BaseMaterial);
    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
    protected draw(gl: WebGL2RenderingContext, context: RendererContext, outputRenderTarget: RenderTargetOperation): void;
}

declare class GrayScaleShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: GrayScaleMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class MosaicShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: MosaicMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class RGBShiftShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: RGBShiftMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class GlitchShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: GlitchMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class FinalBlitShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: FrameBufferTexturedMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class BlurShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: BlurMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class BrightShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: BrightMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class SingleDirectionBlurShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: BlurMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare class ComposeShaderPass extends BaseShaderPass {
    private bloomTexture;
    constructor(gl: WebGL2RenderingContext, material: ComposeMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setBloomTexture(bloomFrame: RenderTargetOperation): void;
}

declare class BloomShaderPass implements ShaderPassOperation {
    private brightShaderPass;
    private horizontalBlurShaderPass;
    private verticalBlurShaderPass;
    private composeShaderPass;
    private isEffectEnabled;
    constructor(gl: WebGL2RenderingContext, brightMaterial: BrightMaterial, horizontalBlurMaterial: BlurMaterial, verticalBlurMaterial: BlurMaterial, composeMaterial: ComposeMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}

declare class MaskShaderPass extends BaseShaderPass {
    constructor(gl: WebGL2RenderingContext, material: MaskMaterial);
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
}

declare function initializeLibrary(): void;

export { AttachmentType, AttributeElementSize, AudioOutput, BaseApplication, BaseBuffer, BaseGeometry, BaseMaterial, BaseMesh, BaseSceneRendererFlow, BaseShaderPass, BloomShaderPass, BlurMaterial, BlurShaderPass, BrightMaterial, BrightShaderPass, Camera, CameraType, Clock, Color, Color255, ColorUtility, ComposeMaterial, ComposeShaderPass, CustomRenderTarget, DefaultColorConstants, DefaultValueConstants, DefaultVectorConstants, DirectionalLightNode, EmptyNode, ExternalFileAudioInput, FinalBlitRendererFlow, FinalBlitShaderPass, FixedTimeClock, FontGlyph, FragmentCanvasMaterial, FrameBufferTexturedMaterial, FullScreenQuadMesh, GeometryBuffer, GlitchMaterial, GlitchShaderPass, GlobalUniformKey, GouraudMaterial, GrayScaleMaterial, GrayScaleShaderPass, GroupNode, IndexBuffer, Light, LightNode, LightType, MaskMaterial, MaskShaderPass, MaterialFactory, MathUtility, Matrix, Matrix22, Matrix33, Matrix44, MatrixCalculator, MatrixClassAndSizePair, MeshNode, MosaicMaterial, MosaicShaderPass, MyColorCode, MyColorConstants255, NumberByte, PhongMaterial, PingPongRenderTarget, Plane, PointLightNode, PostEffectRendererFlow, Quaternion, QuaternionCalculator, RGBShiftMaterial, RGBShiftShaderPass, RealTimeClock, RecordScene, RecordingApplication, Rectangle, RenderTagConstants, RenderTargetSlot, RendererContext, Scene, SceneGraphNodeIdGenerator, SceneGraphUtility, SceneNode, SceneRendererPipeline, ScreenRenderTarget, ShaderAttribute, ShaderAudioInput, ShaderLoader, ShaderProgram, ShaderUniform, ShaderUniformBuffer, ShaderUniformValue, SimpleMesh, SingleDirectionBlurShaderPass, Sphere, StandardSceneRendererFlow, TextFontLoader, TextMesh, TextMeshNode, TextQuad, Texture2D, TextureFrameBuffer, TextureLoader, TextureSlot, TexturedMaterial, Torus, Transform, TrigonometricConstants, UniformBindingPoint, UnlitMaterial, UnlitMesh, Vector, Vector2, Vector3, Vector4, VectorCalculator, VectorClassAndSizePair, VertexArray, WebGLUtility, initializeLibrary };
export type { ApplicationOperation, AttachmentConfig, AudioInputOperation, BaseLightParams, BufferOperation, CameraDirection, CameraOptions, ClockOperation, CustomRenderTargetOption, DirectionalLightParams, FontGlyphData, GeometryOperation, GlobalUniformKeyValue, LightOperation, LightParams, MaterialOperation, MatrixOperation, MeshOperation, PointLightParams, RenderTag, RenderTargetOperation, RenderTargetOption, RenderTargetSlotKey, RendererFlowOperation, RendererFlowOptions, SceneOperation, SceneRendererPipelineOperation, ShaderPassOperation, TextureOperation, UniformAvailableType, UniformBindingPointKey, UniformPairs, UniformType, UniformValueType, VectorOperation };
