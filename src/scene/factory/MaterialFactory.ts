import { Color } from "../../color/Color";
import { ColorUtility } from "../../color/ColorUtility";
import { Vector3 } from "../../math/vector/Vector3";
import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { TextureLoader } from "../../webgl/gl/texture/TextureLoader";
import { FragmentCanvasMaterial } from "../material/FragmentCanvasMaterial";
import { FrameBufferTexturedMaterial } from "../material/FrameBufferTexturedMaterial";
import { GouraudMaterial } from "../material/GouraudMaterial";
import { GrayScaleMaterial } from "../material/GrayScaleMaterial";
import { MosaicMaterial } from "../material/MosaicMaterial";
import { PhongMaterial } from "../material/PhongMaterial";
import { RGBShiftMaterial } from "../material/RGBShiftMaterial";
import { TexturedMaterial } from "../material/TexturedMaterial";
import { UnlitMaterial } from "../material/UnlitMaterial";

export class MaterialFactory {
    private static shaderLoader: ShaderLoader;
    private static textureLoader: TextureLoader;
    
    static init(shaderLoader: ShaderLoader, textureLoader: TextureLoader): void {
        this.shaderLoader = shaderLoader;
        this.textureLoader = textureLoader;
    }

    static fragmentCanvasMaterial(programKey: string): FragmentCanvasMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram(programKey);
        return new FragmentCanvasMaterial(shader);
    }

    static texturedMaterial(textureKey: string, texIndex: number): TexturedMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("texture");
        const texture = this.textureLoader.getTexture(textureKey);
        return new TexturedMaterial(shader, texture, texIndex);
    }

    static frameBufferTextureMaterial(): FrameBufferTexturedMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("framebuffer");
        return new FrameBufferTexturedMaterial(shader);
    }

    static grayScaleMaterial(): GrayScaleMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("grayScale");
        return new GrayScaleMaterial(shader);
    }

    static mosaicMaterial(): MosaicMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("mosaic");
        return new MosaicMaterial(shader);
    }

    static rgbShiftMaterial(): MosaicMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†ory not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("rgbShift");
        return new RGBShiftMaterial(shader);
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