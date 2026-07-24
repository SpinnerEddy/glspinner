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

type SettingValue = number | string | boolean | RecordType;
type SettingArray = number[] | Float32Array | string[] | boolean[];
type SettingType = SettingValue | SettingArray;
type SettingElement = Record<string, SettingType>;
declare class GuiUtility {
    private static guiArrays;
    static initialize(): void;
    static addFolder(folderName: string): void;
    static resetFolder(): void;
    static addElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void, options?: T[K][] | Record<string, T[K]>): void;
    static addElementWithRange<T extends SettingElement, K extends keyof T>(params: T, name: K, min: number, max: number, onChangeAction?: (value: T[K]) => void): void;
    static addColorElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void): void;
    static addAction(action: () => void, name: string): void;
    private static get GUI();
}

type ClockType = 'RealTime' | 'Fixed';
declare class RecordGuiController {
    private static recordType;
    private static clockType;
    private static fps;
    private static fixedFrameInterval;
    private static frameNum;
    private static width;
    private static height;
    private static saveName;
    private static onRecordStart;
    private static onRecordEnd;
    private static onChangeClockType;
    static initialize(onRecordStart: () => void, onRecordEnd: () => void, onChangeClockType: (clockType: ClockType) => void): void;
    static get recordOptions(): RecordOptions;
    static get clock(): ClockType;
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

type LightOptions = {
    ambientColor: string;
    lightDirection: Vector3;
    eyeDirection: Vector3;
};
declare class LightGuiController {
    private static ambientColor;
    private static lightDirectionX;
    private static lightDirectionY;
    private static lightDirectionZ;
    private static eyeDirectionX;
    private static eyeDirectionY;
    private static eyeDirectionZ;
    static initialize(): void;
    static get lightOptions(): LightOptions;
}

declare class AudioGuiController {
    private static onAudioPlay;
    private static onAudioStop;
    static initialize(onAudioPlay: () => void, onAudioStop: () => void): void;
}

interface RenderTargetOperation {
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
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

interface ShaderPassOperation {
    render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}

declare class PostEffectGuiController {
    static initialize(shaderPasses: Map<string, ShaderPassOperation>, shaderPassEnabledSwitch: Map<string, boolean>, onSwitch: (key: string, enabled: boolean) => void): void;
}

declare class PlaySceneGuiController {
    private static onPlayScene;
    private static onStopScene;
    static initialize(onPlayScene: () => void, onStopScene: () => void): void;
}

export { AudioGuiController, GuiUtility, LightGuiController, PlaySceneGuiController, PostEffectGuiController, RecordGuiController, Recorder };
export type { ClockType, LightOptions, RecordOptions, RecordType };
