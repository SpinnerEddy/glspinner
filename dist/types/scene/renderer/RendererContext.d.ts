import { RenderTargetSlotKey } from "../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../webgl/gl/fbo/RenderTargetOperation";
import { ShaderProgram } from "../../webgl/gl/ShaderProgram";
import { UniformPairs } from "../../webgl/gl/uniform/ShaderUniformConstants";
import { ShaderUniformValue } from "../../webgl/gl/uniform/ShaderUniformValue";
import { Camera } from "../camera/Camera";
import { LightParams } from "../light/LightConstants";
export declare class RendererContext {
    private camera;
    private lights;
    private globalUniforms;
    private currentShaderProgram;
    private renderTargetPool;
    getRenderTargetFromPool(key: RenderTargetSlotKey): RenderTargetOperation | undefined;
    addRenderTargetToPool(key: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void;
    setCamera(camera: Camera): void;
    getCamera(): Camera;
    updateGlobalUniform(key: string, value: ShaderUniformValue): void;
    getGlobalUniform(): UniformPairs;
    setCurrentShaderProgram(program: ShaderProgram): void;
    isCurrentShaderProgramSame(program: ShaderProgram): boolean;
    setLights(lights: LightParams[]): void;
    getLights(): LightParams[];
}
