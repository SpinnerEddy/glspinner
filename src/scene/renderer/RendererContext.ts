import { MatrixCalculator } from "../../math/MatrixCalculator";
import { ShaderUniformBuffer } from "../../webgl/gl/buffer/ShaderUniformBuffer";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { GlobalUniformKey, UniformBindingPoint, UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
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

    private globalUniformBuffer: ShaderUniformBuffer;

    constructor(gl: WebGL2RenderingContext) {
        this.renderTargetRegistry = new RenderTargetRegistry();
        
        const globalUniformPairs = {
            [GlobalUniformKey.VIEW_MATRIX] : new ShaderUniformValue(MatrixCalculator.identity44()),
            [GlobalUniformKey.PROJECTION_MATRIX] : new ShaderUniformValue(MatrixCalculator.identity44()),
            [GlobalUniformKey.TIME] : new ShaderUniformValue(0)
        };
        this.globalUniformBuffer = new ShaderUniformBuffer(gl, globalUniformPairs);
        this.globalUniformBuffer.setData();
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

    public updateGlobalUniform(key: string, value: ShaderUniformValue): void {
        this.globalUniforms[key] = value;
    }

    public getGlobalUniform(): UniformPairs {
        return this.globalUniforms;
    }
    
    public updateGlobalUniformValues(time: number): void {
        this.globalUniformBuffer.updateUniformValue(GlobalUniformKey.TIME, new ShaderUniformValue(time));
        
        if (this.camera === undefined) return;
        this.globalUniformBuffer.updateUniformValue(GlobalUniformKey.VIEW_MATRIX, new ShaderUniformValue(this.camera.getViewMatrix()));
        this.globalUniformBuffer.updateUniformValue(GlobalUniformKey.PROJECTION_MATRIX, new ShaderUniformValue(this.camera.getProjectionMatrix()));
    }

    public bindGlobalUniforms(): void {
        this.globalUniformBuffer.transferUniform();
        this.globalUniformBuffer.bind(UniformBindingPoint.GLOBAL);
    }

    public updateFragmentCanvasUniform(key: string, value: ShaderUniformValue): void {
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