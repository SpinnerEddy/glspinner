import { ShaderPassOperation } from "../../scene/renderer/postEffect/ShaderPassOperation";
export declare class PostEffectGuiController {
    static initialize(shaderPasses: Map<string, ShaderPassOperation>, shaderPassEnabledSwitch: Map<string, boolean>, onSwitch: (key: string, enabled: boolean) => void): void;
}
