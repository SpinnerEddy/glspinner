export declare const RenderTagConstants: {
    readonly BACKGROUND: 0;
    readonly OPAQUE: 1;
    readonly EMISSIVE: 2;
    readonly TRANSPARENT: 3;
    readonly DISTORTION: 4;
    readonly OVERLAY: 5;
    readonly ALL: -1;
};
export type RenderTag = typeof RenderTagConstants[keyof typeof RenderTagConstants];
