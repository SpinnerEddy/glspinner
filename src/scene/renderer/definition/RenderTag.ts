export const RenderTagConstants = {
    BACKGROUND: 0,
    OPAQUE: 1,
    EMISSIVE: 2,
    TRANSPARENT: 3,
    DISTORTION: 4,
    OVERLAY: 5,
    ALL: -1,
} as const;

export type RenderTag = typeof RenderTagConstants[keyof typeof RenderTagConstants];