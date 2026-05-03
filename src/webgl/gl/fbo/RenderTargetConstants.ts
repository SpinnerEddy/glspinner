export const RenderTargetSlot = 
{ 
    CURRENT_FRAME: 0,
    TEMP_FRAME_BUFFER: 1,
    PREV_FRAME: 2,
    HALF_RES_BUFFER: 3,
    BRIGHT_PASS_BUFFER: 4,
    BLOOM_RENDER_TARGET: 5,

    PINGPONG_TEMP_BUFFER: 100,
} as const;

export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];