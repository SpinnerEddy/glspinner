import { GuiUtility } from "./GuiUtility";

export class AudioGuiController {
    private static onAudioPlay: () => void;
    private static onAudioStop: () => void;

    static initialize(onAudioPlay: () => void,  onAudioStop: () => void): void {
        this.onAudioPlay = onAudioPlay;
        this.onAudioStop = onAudioStop;

        GuiUtility.initialize();
        GuiUtility.addFolder("Audio");
        GuiUtility.addAction(() => {
            this.onAudioPlay?.();
        }, 
        "AudioPlay");
        GuiUtility.addAction(() => {
            this.onAudioStop?.();
        }, 
        "AudioStop");
        GuiUtility.resetFolder();
    }
}