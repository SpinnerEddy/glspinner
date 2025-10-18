import { Vector3 } from "../../math/vector/Vector3";
export type LightOptions = {
    ambientColor: string;
    lightDirection: Vector3;
    eyeDirection: Vector3;
};
export declare class LightGuiController {
    private static ambientColor;
    private static lightDirectionX;
    private static lightDirectionY;
    private static lightDirectionZ;
    private static eyeDirectionX;
    private static eyeDirectionY;
    private static eyeDirectionZ;
    static initialize(): void;
    static get lightOptions(): LightOptions;
}
