import { ShaderPassOperation } from "../../scene/renderer/postEffect/ShaderPassOperation";
import { GuiUtility } from "./GuiUtility";

export class PostEffectGuiController {
    static initialize(shaderPasses: Map<string, ShaderPassOperation>, shaderPassEnabledSwitch: Map<string, boolean>, onSwitch: (key: string, enabled: boolean) => void): void {
        GuiUtility.initialize();

        GuiUtility.addFolder("PostEffect");
        for (const key of shaderPasses.keys()) {
            const keyString = key.toString();
            const params = { [keyString]: shaderPassEnabledSwitch.get(keyString) } as Record<string, boolean>;
            GuiUtility.addElement(
                params, 
                keyString,
                (value: boolean) => {
                    onSwitch(keyString, value);
                }
            );
        }
        GuiUtility.resetFolder();
    }
}