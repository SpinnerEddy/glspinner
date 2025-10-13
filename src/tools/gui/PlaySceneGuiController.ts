import { GuiUtility } from "./GuiUtility";

export class PlaySceneGuiController {
    private static onPlayScene: () => void;
    private static onStopScene: () => void;

    static initialize(onPlayScene: () => void,  onStopScene: () => void): void {
        this.onPlayScene = onPlayScene;
        this.onStopScene = onStopScene;

        GuiUtility.initialize();
        GuiUtility.addFolder("Scene");
        GuiUtility.addAction(() => {
            this.onPlayScene?.();
        }, 
        "PlayScene");
        GuiUtility.addAction(() => {
            this.onStopScene?.();
        }, 
        "StopScene");
        GuiUtility.resetFolder();
    }
}