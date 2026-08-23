import { Color } from './Color';
import { Color255 } from './Color255';
import { MyColorConstants255 } from './ColorConstants';

export class ColorUtility {
    public static hexToColor255(colorCode: string): Color255 {
        const format = /^#([0-9A-Fa-f]{6})$/;
        const result = format.exec(colorCode);

        if (!result) {
            return MyColorConstants255.COLOR_EMPTY;
        }

        const hexColor = result[1];

        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);

        return new Color255(r, g, b);
    }

    public static hexToColor01(colorCode: string): Color {
        const color255 = this.hexToColor255(colorCode);

        return color255.translateTo01();
    }

    public static hsvToRgb(hue: number, saturation: number, value: number, alpha: number): Color {
        if (saturation > 1 || value > 1 || alpha > 1) return Color.empty();

        const th = hue % 360;
        const i = Math.floor(th / 60);
        const f = th / 60 - i;
        const m = value * (1 - saturation);
        const n = value * (1 - saturation * f);
        const k = value * (1 - saturation * (1 - f));
        const color = [];
        if (!(saturation > 0) && !(saturation < 0)) {
            color.push(value, value, value, alpha);
        } else {
            const r = [value, n, m, m, k, value];
            const g = [k, value, value, n, m, m];
            const b = [m, m, k, value, value, n];
            color.push(r[i], g[i], b[i], alpha);
        }
        return new Color(color[0], color[1], color[2], color[3]);
    }
}
