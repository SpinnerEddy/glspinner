import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { MeshNode } from "../../core/node/MeshNode";
import { BaseMaterial } from "../../material/BaseMaterial";
import { RendererContext } from "../RendererContext";
import { ShaderPassOperation } from "./ShaderPassOperation";
export declare abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: MeshNode;
    protected isEffectEnabled: boolean;
    constructor(gl: WebGL2RenderingContext, material: BaseMaterial);
    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
    protected draw(gl: WebGL2RenderingContext, context: RendererContext, outputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;
}
