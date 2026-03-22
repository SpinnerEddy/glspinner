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

export type CustomRenderTargetOption = {
    attachments: AttachmentType[]
}

export type RenderTargetOption = {
    colorTextureCount?: number,
    useDepth?: boolean
}