export const RenderTargetSlot = 
{ 
    RENDER_TARGET_A: 0,
    RENDER_TARGET_B: 1,
    PREV_FRAME_RENDER_TARGET: 2,
    BLUR_RENDER_TARGET_HALF: 3,
    BLOOM_TEMP_RENDER_TARGET_BRIGHT: 4,
    BLOOM_RENDER_TARGET: 5,
    RENDER_TARGET_EFFECTED: 6,

    BLOOM_TEMP_PP_RENDER_TARGET_BLUR: 105,
} as const;

export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];