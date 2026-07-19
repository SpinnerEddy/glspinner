import { PingPongRenderTarget } from "../../../webgl/gl/fbo/PingPongRenderTarget";
import { RenderTargetSlotKey } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ScreenRenderTarget } from "../../../webgl/gl/fbo/ScreenRenderTarget";
import { RenderTargetRegistryOperation } from "./RenderTargetRegistryOperation";
export declare class RenderTargetRegistry implements RenderTargetRegistryOperation {
    private renderTargetPool;
    private screenRenderTarget;
    private pingPongRenderTargetPool;
    getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined;
    addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void;
    getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined;
    addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget): void;
    getScreenRenderTarget(): ScreenRenderTarget;
    setScreenRenderTarget(screenRenderTarget: ScreenRenderTarget): void;
    dispose(): void;
}
