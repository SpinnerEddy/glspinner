export declare const RenderTargetSlot: {
    readonly RENDER_TARGET_A: 0;
    readonly RENDER_TARGET_B: 1;
    readonly PREV_FRAME_RENDER_TARGET: 2;
    readonly BLUR_RENDER_TARGET_HALF: 3;
    readonly BLUR_RENDER_TARGET_QUARTER: 4;
    readonly BLOOM_TEMP_RENDER_TARGET_BRIGHT: 5;
    readonly BLOOM_TEMP_RENDER_TARGET_BLUR_H: 6;
    readonly BLOOM_TEMP_RENDER_TARGET_BLUR_V: 7;
    readonly BLOOM_RENDER_TARGET: 8;
};
export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];
