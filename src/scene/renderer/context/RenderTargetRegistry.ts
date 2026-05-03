import { PingPongRenderTarget } from "../../../webgl/gl/fbo/PingPongRenderTarget";
import { RenderTargetSlotKey } from "../../../webgl/gl/fbo/RenderTargetConstants";
import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { ScreenRenderTarget } from "../../../webgl/gl/fbo/ScreenRenderTarget";
import { RenderTargetRegistryOperation } from "./RenderTargetRegistryOperation";

export class RenderTargetRegistry implements RenderTargetRegistryOperation {

    private renderTargetPool: Map<RenderTargetSlotKey, RenderTargetOperation> = new Map();
    private screenRenderTarget : ScreenRenderTarget | undefined = undefined;
    private pingPongRenderTargetPool: Map<RenderTargetSlotKey, PingPongRenderTarget> = new Map();

    getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined {
        if(!this.renderTargetPool.has(slot)) {
            return undefined;
        }

        return this.renderTargetPool.get(slot);
    }

    addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation): void {
        this.renderTargetPool.set(slot, renderTarget);
    }

    getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined {
        if(!this.pingPongRenderTargetPool.has(slot)) {
            return undefined;
        }

        return this.pingPongRenderTargetPool.get(slot);
    }

    addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget): void {
        this.pingPongRenderTargetPool.set(slot, pingPongRenderTarget);
    }

    getScreenRenderTarget(): ScreenRenderTarget {
        return this.screenRenderTarget!;
    }

    setScreenRenderTarget(screenRenderTarget: ScreenRenderTarget): void {
        this.screenRenderTarget = screenRenderTarget;
    }

    dispose(): void {
        this.renderTargetPool.forEach(rt => rt.dispose());
        this.renderTargetPool.clear();

        this.pingPongRenderTargetPool.forEach(ppRT => ppRT.dispose());
        this.pingPongRenderTargetPool.clear();

        this.screenRenderTarget?.dispose();
    }

}