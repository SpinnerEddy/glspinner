import { RenderTargetOperation } from "./RenderTargetOperation";
import { AttachmentType, CustomRenderTargetOption } from "./RenderTargetOption";

export class CustomRenderTarget implements RenderTargetOperation {
    private gl: WebGL2RenderingContext;
    
    private framebuffer!: WebGLFramebuffer;
    private colorTextures!: WebGLTexture[];

    private depthRenderbuffer: WebGLRenderbuffer | undefined;
    
    private width: number;
    private height: number;

    private option: CustomRenderTargetOption;
    private colorTextureCount: number;
    private drawBufferAttachmentPoints: number[];

    constructor(gl: WebGL2RenderingContext, resolution: [number, number], option: CustomRenderTargetOption = { attachments: [AttachmentType.COLOR]}) {
        this.gl = gl;
        this.width = resolution[0];
        this.height = resolution[1];

        this.framebuffer = gl.createFramebuffer();
        this.colorTextures = [];
        this.option = option;
        this.colorTextureCount = 0;
        this.drawBufferAttachmentPoints = [];

        this.initialize(option);
    }

    bindAsDrawTarget(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer!);
        this.gl.viewport(0, 0, this.width, this.height);
    }

    getFrameBuffer(): WebGLFramebuffer {
        return this.framebuffer;    
    }

    getColorTexture(index: number = 0): WebGLTexture {
        if(index !== 0){
            throw new Error("Only single color attachment supported!");
        }
        return this.colorTextures?.at(index)!;
    }

    getSize(): [number, number] {
        return [this.width, this.height];
    }

    resize(resolution: [number, number]): void {
        if(this.width === resolution[0] && this.height === resolution[1]) return;

        this.width = resolution[0];
        this.height = resolution[1];

        this.dispose();

        this.framebuffer = this.gl.createFramebuffer();

        this.initialize(this.option);
    }

    dispose(): void {
        const gl = this.gl;

        if (this.colorTextures) {
            this.colorTextures.forEach(element => {
                gl.deleteTexture(element);
            });
        }
        if (this.depthRenderbuffer) {
            gl.deleteRenderbuffer(this.depthRenderbuffer);
        }
        if (this.framebuffer) {
            gl.deleteFramebuffer(this.framebuffer);
        }
    }

    private initialize(option: CustomRenderTargetOption): void {
        const gl = this.gl;

        this.colorTextures = [];
        this.colorTextureCount = 0;
        this.drawBufferAttachmentPoints = [];

        // フレームバッファ
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        option.attachments.forEach((type) => {
            this.setUpAttachment(gl, type);
        });

        if (this.drawBufferAttachmentPoints.length > 0) {
            gl.drawBuffers(this.drawBufferAttachmentPoints);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private setUpAttachment(gl: WebGL2RenderingContext, type: AttachmentType): void {
        switch (type){
            case AttachmentType.DEPTH:
            case AttachmentType.STENCIL:
            case AttachmentType.DEPTH_STENCIL:
                this.depthRenderbuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer);
                
                const renderbufferSetting = this.getRenderbufferSettingByAttachmentType(gl, type);
                gl.renderbufferStorage(gl.RENDERBUFFER, renderbufferSetting.internalFormat, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, renderbufferSetting.attachmentPoint, gl.RENDERBUFFER, this.depthRenderbuffer);
                break;
            case AttachmentType.DEPTH_TEXTURE:
                const depthTex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, depthTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTex, 0);
                break;
            default:
                const colorTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, colorTexture);

                const textureSetting = this.getColorTextureSettingByAttachmentType(gl, type);
                gl.texImage2D(gl.TEXTURE_2D, 0, textureSetting.internalFormat, 
                    this.width, this.height, 0, textureSetting.format, 
                    textureSetting.texNumberType, null);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                const attachmentPoint = gl.COLOR_ATTACHMENT0 + this.colorTextureCount;
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, colorTexture, 0);
                this.colorTextures.push(colorTexture);
                this.drawBufferAttachmentPoints.push(attachmentPoint);
                this.colorTextureCount++;
                break;
        }
    }

    private getColorTextureSettingByAttachmentType(gl: WebGL2RenderingContext, type: AttachmentType) {
        let internalFormat = -1;
        let format = -1;
        let texNumberType = -1;
        switch (type){
            case AttachmentType.COLOR:
                internalFormat = gl.RGBA8;
                format = gl.RGBA;
                texNumberType = gl.UNSIGNED_BYTE;
                break;
            case AttachmentType.ID:
                internalFormat = gl.R8;
                format = gl.RED;
                texNumberType = gl.UNSIGNED_BYTE;
                break;
            case AttachmentType.NORMAL:
                internalFormat = gl.RGB16F;
                format = gl.RGB;
                texNumberType = gl.HALF_FLOAT;
                break;
            case AttachmentType.EMISSIVE:
                internalFormat = gl.RGBA16F;
                format = gl.RGBA;
                texNumberType = gl.HALF_FLOAT;
                break;
        }

        return {internalFormat, format, texNumberType};
    }

    private getRenderbufferSettingByAttachmentType(gl: WebGL2RenderingContext, type: AttachmentType) {
        let internalFormat = -1;
        let attachmentPoint = -1;
        switch (type){
            case AttachmentType.DEPTH:
                internalFormat = gl.DEPTH_COMPONENT16;
                attachmentPoint = gl.DEPTH_ATTACHMENT;
                break;
            case AttachmentType.STENCIL:
                internalFormat = gl.STENCIL_INDEX8;
                attachmentPoint = gl.STENCIL_ATTACHMENT;
                break;
            case AttachmentType.DEPTH_STENCIL:
                internalFormat = gl.DEPTH24_STENCIL8;
                attachmentPoint = gl.DEPTH_STENCIL_ATTACHMENT;
                break;
        }

        return {internalFormat, attachmentPoint};
    }
}