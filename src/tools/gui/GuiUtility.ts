import GUI from 'lil-gui'
import { RecordType } from '../Recorder';

type SettingValue = number | string | boolean | RecordType;
type SettingArray = number[] | Float32Array | string[] | boolean[]
type SettingType = SettingValue | SettingArray;

type SettingElement = Record<string, SettingType>;

export class GuiUtility{
    private static guiArrays: Array<GUI> = [];

    static initialize(){
        if(this.guiArrays.length > 0) return;

        this.guiArrays.push(new GUI());
    }

    static addFolder(folderName: string){
        const gui = this.GUI;
        const folder = gui.addFolder(folderName);
        this.guiArrays.push(folder);
    }

    static resetFolder(){
        if(this.guiArrays.length <= 1) return;

        this.guiArrays.pop();
    }

    static addElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void, options?: T[K][] | Record<string, T[K]>){
        const gui = this.GUI;
        const controller = options ? gui.add(params, name as string, options) : gui.add(params, name as string);
        if(onChangeAction){
            controller.onChange(onChangeAction);
        }
    }

    static addElementWithRange<T extends SettingElement, K extends keyof T>(params: T, name: K, min: number, max: number, onChangeAction?: (value: T[K]) => void){
        const gui = this.GUI;
        const controller = gui.add(params, name as string, min, max);
        if(onChangeAction){
            controller.onChange(onChangeAction);
        }
    }

    static addColorElement<T extends SettingElement, K extends keyof T>(params: T, name: K, onChangeAction?: (value: T[K]) => void){
        const gui = this.GUI;
        const controller = gui.addColor(params, name as string);
        if(onChangeAction){
            controller.onChange(onChangeAction);
        }
    }

    static addAction(action: () => void, name: string): void {
        const gui = this.GUI;
        const actionObject = {[name]: action}
        gui.add(actionObject, name);
    }

    private static get GUI(): GUI {
        if (this.guiArrays.length == 0)
        {
            this.guiArrays.push(new GUI());
        }

        return this.guiArrays.at(-1)!;
    }
}