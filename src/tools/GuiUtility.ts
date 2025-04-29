import GUI from 'lil-gui'

type SettingValue = number | string | boolean;
type SettingArray = number[] | Float32Array | string[] | boolean[]
type SettingType = SettingValue | SettingArray;

type SettingElement = Record<string, SettingType>;

export class GuiUtility{
    private static parentGUI: GUI | undefined = undefined;
    private static targetFolderGUI: GUI | undefined = undefined;


    static initialize(){
        if(!this.parentGUI == null) return;

        this.parentGUI = new GUI();
    }

    static addFolder(folderName: string){
        const gui = this.GUI;
        const folder = gui.addFolder(folderName);
        this.targetFolderGUI = folder;
    }

    static resetFolder(){
        this.targetFolderGUI = undefined;
    }

    static addElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void){
        const gui = this.GUI;
        const controller = gui.add(params, name as string);
        if(onChangeAction){
            controller.onChange(onChangeAction);
        }
    }

    private static get GUI(): GUI {
        if(this.targetFolderGUI != undefined) return this.targetFolderGUI;
        if(this.parentGUI == undefined) this.parentGUI = new GUI();

        return this.parentGUI;
    }
}