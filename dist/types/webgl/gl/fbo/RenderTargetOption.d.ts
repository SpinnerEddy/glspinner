export declare enum AttachmentType {
    COLOR = 0,
    ID = 1,
    NORMAL = 2,
    EMISSIVE = 3,
    DEPTH = 4,
    DEPTH_TEXTURE = 5,
    STENCIL = 6,
    DEPTH_STENCIL = 7
}
export type AttachmentConfig = {
    type: AttachmentType;
    minFilter?: number;
    magFilter?: number;
};
export type CustomRenderTargetOption = {
    attachments: AttachmentConfig[];
};
export type RenderTargetOption = {
    colorTextureCount?: number;
    useDepth?: boolean;
};
