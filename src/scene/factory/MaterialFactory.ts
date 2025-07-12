import { Color } from "../../color/Color";
import { ColorUtility } from "../../color/ColorUtility";
import { Vector3 } from "../../math/vector/Vector3";
import { ShaderLoader } from "../../webgl/gl/ShaderLoader";
import { PhongMaterial } from "../material/PhongMaterial";

export class MaterialFactory {
    private static shaderLoader: ShaderLoader;

    static init(shaderLoader: ShaderLoader): void {
        this.shaderLoader = shaderLoader;
    }

    static phongMaterial(lightDirection?: Vector3, eyeDirection?: Vector3, ambientColor?: Color): PhongMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†øry not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("phongLighting");
        const ld = lightDirection ?? new Vector3(-0.5, 0.5, 0.5);
        const ed = eyeDirection ?? new Vector3(0, 0, 20.0);
        const amb = ambientColor ?? ColorUtility.hexToColor01("#000000");
        return new PhongMaterial(shader, ld, ed, amb);
    }

    static gouraudMaterial(lightDirection?: Vector3, eyeDirection?: Vector3, ambientColor?: Color): PhongMaterial {
        if (!this.shaderLoader) {
            throw new Error('MaterialFac†øry not initialized. Call init!!');
        }

        const shader = this.shaderLoader.getShaderProgram("gouraudLighting");
        const ld = lightDirection ?? new Vector3(-0.5, 0.5, 0.5);
        const ed = eyeDirection ?? new Vector3(0, 0, 20.0);
        const amb = ambientColor ?? ColorUtility.hexToColor01("#000000");
        return new PhongMaterial(shader, ld, ed, amb);
    }
}