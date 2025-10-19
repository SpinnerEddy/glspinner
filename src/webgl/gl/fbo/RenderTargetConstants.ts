export const RenderTargetSlot = 
{ 
    BLIT_RENDER_TARGET: 0,
    CURRENT_FRAME_RENDER_TARGET: 1,
    PREV_FRAME_RENDER_TARGET: 2,
    BLUR_RENDER_TARGET_HALF: 3,
    BLUR_RENDER_TARGET_QUARTER: 4,
} as const;

export type RenderTargetSlotKey = typeof RenderTargetSlot[keyof typeof RenderTargetSlot];