import { PingPongRenderTarget } from "../../webgl/gl/fbo/PingPongRenderTarget";
import { RenderTargetSlotKey } from "../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../webgl/gl/fbo/RenderTargetOperation";
import { ScreenRenderTarget } from "../../webgl/gl/fbo/ScreenRenderTarget";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { Camera } from "../camera/Camera";
import { LightParams } from "../light/LightConstants";

export class RendererContext {
    private camera: Camera | undefined = undefined;
    private lights: LightParams[] = [];
    private globalUniforms: UniformPairs = {};
    private fragmentCanvasUniforms: UniformPairs = {};
    private currentShaderProgram: ShaderProgram | undefined = undefined;
    private renderTargetPool: Map<RenderTargetSlotKey, RenderTargetOperation> = new Map();
    private screenRenderTarget : ScreenRenderTarget | undefined = undefined;
    private pingPongRenderTargetPool: Map<RenderTargetSlotKey, PingPongRenderTarget> = new Map();

    public getRenderTargetFromPool(key: RenderTargetSlotKey): RenderTargetOperation | undefined {
        if(!this.renderTargetPool.has(key)) {
            return undefined;
        }

        return this.renderTargetPool.get(key);
    }

    public addRenderTargetToPool(key: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void {
        this.renderTargetPool.set(key, renderTarget);
    }

    public getPingPongRenderTargetFromPool(key: RenderTargetSlotKey): PingPongRenderTarget | undefined {
        if(!this.pingPongRenderTargetPool.has(key)) {
            return undefined;
        }

        return this.pingPongRenderTargetPool.get(key);
    }

    public addPingPongRenderTargetToPool(key: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget): void {
        this.pingPongRenderTargetPool.set(key, pingPongRenderTarget);
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    public getCamera(): Camera {
        return this.camera!;
    }

    public updateGlobalUniform(key: string, value: ShaderUniformValue): void{
        this.globalUniforms[key] = value;
    }

    public getGlobalUniform(): UniformPairs {
        return this.globalUniforms;
    }

    public updateFragmentCanvasUniform(key: string, value: ShaderUniformValue): void{
        this.fragmentCanvasUniforms[key] = value;
    }

    public getFragmentCanvasUniform(): UniformPairs {
        return this.fragmentCanvasUniforms;
    }

    public setCurrentShaderProgram(program: ShaderProgram): void {
        this.currentShaderProgram = program;
    }

    public isCurrentShaderProgramSame(program: ShaderProgram): boolean {
        if(this.currentShaderProgram === undefined) return false;

        return this.currentShaderProgram === program;
    }

    public setLights(lights: LightParams[]): void {
        this.lights = lights;
    }

    public getLights(): LightParams[] {
        return this.lights;
    }

    public setScreenRenderTarget(renderTarget: ScreenRenderTarget) {
        this.screenRenderTarget = renderTarget;
    }

    public getScreenRenderTarget(): ScreenRenderTarget {
        return this.screenRenderTarget!;
    }
}