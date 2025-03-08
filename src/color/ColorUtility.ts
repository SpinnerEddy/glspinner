import { Color } from "./Color";
import { Color255 } from "./Color255";
import { MyColorConstants255 } from "./ColorConstants";

export class ColorUtility
{
    public static hexToColor255(colorCode: string): Color255
    {
        const format = /^#([0-9A-Fa-f]{6})$/;
        const result = format.exec(colorCode);

        if(!result){
            return MyColorConstants255.COLOR_EMPTY;
        }

        let hexColor = result[1];

        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);

        return new Color255(r, g, b);
    } 

    public static hexToColor01(colorCode: string): Color
    {
        const color255 = this.hexToColor255(colorCode);

        return color255.translateTo01();
    } 
}