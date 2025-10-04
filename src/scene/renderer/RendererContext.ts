import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { Camera } from "../camera/Camera";
import { LightParams } from "../light/LightConstants";

export class RendererContext {
    private camera: Camera | undefined = undefined;
    private lights: LightParams[] = [];
    private globalUniforms: UniformPairs = {};
    private currentShaderProgram: ShaderProgram | undefined = undefined;

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