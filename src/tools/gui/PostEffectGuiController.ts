import { ShaderPassOperation } from "../../scene/renderer/postEffect/ShaderPassOperation";
import { GuiUtility } from "./GuiUtility";

export class PostEffectGuiController {
    static initialize(shaderPasses: Map<string, ShaderPassOperation>, onSwitch: (key: string, enabled: boolean) => void): void {
        GuiUtility.initialize();

        GuiUtility.addFolder("PostEffect");
        let index = 0;
        for (const key of shaderPasses.keys()) {
            // 末尾は出力用なのでスキップ
            index++;
            if(index == shaderPasses.size) break;
            
            const keyString = key.toString();
            const params = { [keyString]: true } as Record<string, boolean>;
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