import { Color } from "../../color/Color";
import { ColorUtility } from "../../color/ColorUtility";
import { Vector3 } from "../../math/vector/Vector3";
import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { TextureFrameBuffer } from "../../webgl/gl/texture/TextureFrameBuffer";
import { TextureLoader } from "../../webgl/gl/texture/TextureLoader";
import { FrameBufferTexturedMaterial } from "../material/FrameBufferTexturedMaterial";
import { GouraudMaterial } from "../material/GouraudMaterial";
import { GrayScaleMaterial } from "../material/GrayScaleMaterial";
import { PhongMaterial } from "../material/PhongMaterial";
import { TexturedMaterial } from "../material/TexturedMaterial";
import { UnlitMaterial } from "../material/UnlitMaterial";

export class MaterialFactory {
    private static shaderLoader: ShaderLoader;
    private static textureLoader: TextureLoader;
    

    static init(shaderLoader: ShaderLoader, textureLoader: TextureLoader): void {
        this.shaderLoader = shaderLoader;
        this.textureLoader = textureLoader;
    }

    static texturedMaterial(textureKey: string, texIndex: number): TexturedMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("texture");
        const texture = this.textureLoader.getTexture(textureKey);
        return new TexturedMaterial(shader, texture, texIndex);
    }

    static frameBufferTextureMaterial(frameBuffer: TextureFrameBuffer, texIndex: number): FrameBufferTexturedMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("framebuffer");
        return new FrameBufferTexturedMaterial(shader, frameBuffer, texIndex);
    }

    static grayScaleMaterial(frameBuffer: TextureFrameBuffer, texIndex: number): GrayScaleMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("grayScale");
        return new GrayScaleMaterial(shader, frameBuffer, texIndex);
    }

    static unlitMaterial(): UnlitMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("unlit");
        return new UnlitMaterial(shader);
    } 

    static phongMaterial(): PhongMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("phongLighting");
        return new PhongMaterial(shader);
    }

    static gouraudMaterial(lightDirection?: Vector3, eyeDirection?: Vector3, ambientColor?: Color): GouraudMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("gouraudLighting");
        const ld = lightDirection ?? new Vector3(-0.5, 0.5, 0.5);
        const ed = eyeDirection ?? new Vector3(0, 0, 20.0);
        const amb = ambientColor ?? ColorUtility.hexToColor01("#000000");
        return new GouraudMaterial(shader, ld, ed, amb);
    }
}