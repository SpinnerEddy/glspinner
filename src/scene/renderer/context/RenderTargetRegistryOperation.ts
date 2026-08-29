import { PingPongRenderTarget } from '../../../webgl/gl/fbo/PingPongRenderTarget';
import { RenderTargetSlotKey } from '../../../webgl/gl/fbo/RenderTargetConstants';
import { RenderTargetOperation } from '../../../webgl/gl/fbo/RenderTargetOperation';
import { ScreenRenderTarget } from '../../../webgl/gl/fbo/ScreenRenderTarget';

export interface RenderTargetRegistryOperation {
    getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined;
    addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation, scale?: number): void;
    getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined;
    addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget, scale?: number): void;
    getScreenRenderTarget(): ScreenRenderTarget;
    setScreenRenderTarget(screenRenderTarget: ScreenRenderTarget): void;
    resizeAll(resolution: [number, number]): void;
    dispose(): void;
}
