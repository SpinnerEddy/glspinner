import { PingPongRenderTarget } from '../../../webgl/gl/fbo/PingPongRenderTarget';
import { RenderTargetSlotKey } from '../../../webgl/gl/fbo/RenderTargetConstants';
import { RenderTargetOperation } from '../../../webgl/gl/fbo/RenderTargetOperation';
import { ScreenRenderTarget } from '../../../webgl/gl/fbo/ScreenRenderTarget';
import { RenderTargetRegistryOperation } from './RenderTargetRegistryOperation';

export class RenderTargetRegistry implements RenderTargetRegistryOperation {
    private renderTargetPool: Map<RenderTargetSlotKey, RenderTargetOperation> = new Map();
    private renderTargetScales: Map<RenderTargetSlotKey, number> = new Map();
    private screenRenderTarget: ScreenRenderTarget | undefined = undefined;
    private pingPongRenderTargetPool: Map<RenderTargetSlotKey, PingPongRenderTarget> = new Map();
    private pingPongRenderTargetScales: Map<RenderTargetSlotKey, number> = new Map();

    getRenderTargetFromPool(slot: RenderTargetSlotKey): RenderTargetOperation | undefined {
        if (!this.renderTargetPool.has(slot)) {
            return undefined;
        }

        return this.renderTargetPool.get(slot);
    }

    addRenderTargetToPool(slot: RenderTargetSlotKey, renderTarget: RenderTargetOperation, scale: number = 1.0): void {
        this.renderTargetPool.set(slot, renderTarget);
        this.renderTargetScales.set(slot, scale);
    }

    getPingPongRenderTargetFromPool(slot: RenderTargetSlotKey): PingPongRenderTarget | undefined {
        if (!this.pingPongRenderTargetPool.has(slot)) {
            return undefined;
        }

        return this.pingPongRenderTargetPool.get(slot);
    }

    addPingPongRenderTargetToPool(slot: RenderTargetSlotKey, pingPongRenderTarget: PingPongRenderTarget, scale: number = 1.0): void {
        this.pingPongRenderTargetPool.set(slot, pingPongRenderTarget);
        this.pingPongRenderTargetScales.set(slot, scale);
    }

    getScreenRenderTarget(): ScreenRenderTarget {
        return this.screenRenderTarget!;
    }

    setScreenRenderTarget(screenRenderTarget: ScreenRenderTarget): void {
        this.screenRenderTarget = screenRenderTarget;
    }

    resizeAll(resolution: [number, number]): void {
        this.renderTargetPool.forEach((rt, slot) => {
            const scale = this.renderTargetScales.get(slot) ?? 1.0;
            rt.resize([Math.floor(resolution[0] * scale), Math.floor(resolution[1] * scale)]);
        });

        this.pingPongRenderTargetPool.forEach((ppRT, slot) => {
            const scale = this.pingPongRenderTargetScales.get(slot) ?? 1.0;
            ppRT.resize([Math.floor(resolution[0] * scale), Math.floor(resolution[1] * scale)]);
        });

        this.screenRenderTarget?.resize(resolution);
    }

    dispose(): void {
        this.renderTargetPool.forEach((rt) => rt.dispose());
        this.renderTargetPool.clear();
        this.renderTargetScales.clear();

        this.pingPongRenderTargetPool.forEach((ppRT) => ppRT.dispose());
        this.pingPongRenderTargetPool.clear();
        this.pingPongRenderTargetScales.clear();

        this.screenRenderTarget?.dispose();
    }
}
