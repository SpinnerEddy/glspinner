export const RenderTargetSlot = 
{ 
    RENDER_TARGET_A: 0,
    RENDER_TARGET_B: 1,
    PREV_FRAME_RENDER_TARGET: 2,
    BLUR_RENDER_TARGET_HALF: 3,
    BLUR_RENDER_TARGET_QUARTER: 4,
    BLOOM_TEMP_RENDER_TARGET_BRIGHT: 5,
    BLOOM_TEMP_RENDER_TARGET_BLUR_H: 6,
    BLOOM_TEMP_RENDER_TARGET_BLUR_V: 7,
    BLOOM_RENDER_TARGET: 8,
} as const;

export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];