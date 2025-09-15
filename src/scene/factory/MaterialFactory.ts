import { Color } from "../../color/Color";
import { ColorUtility } from "../../color/ColorUtility";
import { Vector3 } from "../../math/vector/Vector3";
import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { GouraudMaterial } from "../material/GouraudMaterial";
import { PhongMaterial } from "../material/PhongMaterial";
import { UnlitMaterial } from "../material/UnlitMaterial";

export class MaterialFactory {
    private static shaderLoader: ShaderLoader;

    static init(shaderLoader: ShaderLoader): void {
        this.shaderLoader = shaderLoader;
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