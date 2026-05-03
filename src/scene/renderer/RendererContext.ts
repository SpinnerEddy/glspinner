import { PingPongRenderTarget } from "../../webgl/gl/fbo/PingPongRenderTarget";
import { RenderTargetSlotKey } from "../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../webgl/gl/fbo/RenderTargetOperation";
import { ScreenRenderTarget } from "../../webgl/gl/fbo/ScreenRenderTarget";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { Camera } from "../camera/Camera";
import { LightParams } from "../light/LightConstants";
import { RenderTargetRegistry } from "./context/RenderTargetRegistry";
import { RenderTargetRegistryOperation } from "./context/RenderTargetRegistryOperation";

export class RendererContext {
    private camera: Camera | undefined = undefined;
    private lights: LightParams[] = [];
    private globalUniforms: UniformPairs = {};
    private fragmentCanvasUniforms: UniformPairs = {};
    private currentShaderProgram: ShaderProgram | undefined = undefined;
    private renderTargetRegistry: RenderTargetRegistryOperation; 

    constructor() {
        this.renderTargetRegistry = new RenderTargetRegistry();
    }

    public getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined {
        return this.renderTargetRegistry.getRenderTargetFromPool(slot);
    }

    public addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void {
        this.renderTargetRegistry.addRenderTargetToPool(slot, renderTarget);
    }

    public getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined {
        return this.renderTargetRegistry.getPingPongRenderTargetFromPool(slot);
    }

    public addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget): void {
        this.renderTargetRegistry.addPingPongRenderTargetToPool(slot, pingPongRenderTarget);
    }

    public setScreenRenderTarget(renderTarget: ScreenRenderTarget) {
        this.renderTargetRegistry.setScreenRenderTarget(renderTarget);
    }

    public getScreenRenderTarget(): ScreenRenderTarget {
        return this.renderTargetRegistry.getScreenRenderTarget();
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
}