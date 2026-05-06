import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { Camera } from "../camera/Camera";
import { LightParams } from "../light/LightConstants";
import { RenderTargetRegistry } from "./context/RenderTargetRegistry";
import { RenderTargetRegistryOperation } from "./context/RenderTargetRegistryOperation";
import { RenderTag, RenderTagConstants } from "./definition/RenderTag";

export class RendererContext {
    private camera: Camera | undefined = undefined;
    private lights: LightParams[] = [];
    private globalUniforms: UniformPairs = {};
    private fragmentCanvasUniforms: UniformPairs = {};
    private currentShaderProgram: ShaderProgram | undefined = undefined;
    private renderTargetRegistry: RenderTargetRegistryOperation; 
    private activateRenderTag: RenderTag = RenderTagConstants.ALL;

    constructor() {
        this.renderTargetRegistry = new RenderTargetRegistry();
    }

    public getRenderTargetRegistry(): RenderTargetRegistryOperation {
        return this.renderTargetRegistry;
    }

    public setActivateRenderTag(renderTag: RenderTag): void {
        this.activateRenderTag = renderTag;
    }

    public getActivateRenderTag(): RenderTag {
        return this.activateRenderTag;
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