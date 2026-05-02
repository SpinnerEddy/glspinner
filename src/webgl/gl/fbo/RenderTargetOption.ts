export enum AttachmentType {
    COLOR,
    ID,
    NORMAL,
    EMISSIVE,
    DEPTH,
    DEPTH_TEXTURE,
    STENCIL,
    DEPTH_STENCIL
}

export type AttachmentConfig = {
    type: AttachmentType;
    minFilter?: number;
    magFilter?: number;
}

export type CustomRenderTargetOption = {
    attachments: AttachmentConfig[]
}

export type RenderTargetOption = {
    colorTextureCount?: number,
    useDepth?: boolean
}