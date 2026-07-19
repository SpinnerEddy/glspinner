export declare const RenderTargetSlot: {
    readonly CURRENT_FRAME: 0;
    readonly TEMP_FRAME_BUFFER: 1;
    readonly PREV_FRAME: 2;
    readonly HALF_RES_BUFFER: 3;
    readonly BRIGHT_PASS_BUFFER: 4;
    readonly BLOOM_RENDER_TARGET: 5;
    readonly PINGPONG_TEMP_BUFFER: 100;
};
export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];
