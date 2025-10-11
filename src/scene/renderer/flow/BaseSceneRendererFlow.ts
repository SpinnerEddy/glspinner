import { RenderTarget } from "../../../webgl/gl/fbo/RenderTarget";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { RendererContext } from "../RendererContext";
import { RendererFlowOptions } from "./RendererFlowConstants";
import { RendererFlowOperation } from "./RendererFlowOperation";

export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    
    protected renderTarget: RenderTargetOperation | undefined;

    constructor(options: RendererFlowOptions = { useFbo: false }) { 
        if (!options.useFbo) return;

        this.renderTarget = new RenderTarget(options.gl!, [options.resolution![0], options.resolution![1]]);
    }

    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation | undefined): RenderTargetOperation | undefined;
    abstract dispose(): void
}