import { Color } from "../../src/color/Color";
import { MyColorConstants255 } from "../../src/color/ColorConstants";
import { ColorUtility } from "../../src/color/ColorUtility";

test("Color hexToColor255", () => {
    const code = "#F68B1F";
    const result = ColorUtility.hexToColor255(code);
    const color = MyColorConstants255.COLOR_CHINA;
    expect(result).toEqual(color);
});

test("Color hexToColor01", () => {
    const code = "#F68B1F";
    const result = ColorUtility.hexToColor01(code);
    const color = new Color(0.965, 0.545, 0.122, 1);
    expect(result).toEqual(color);
});

test("Color translateTo01", () => {
    const baseColor = MyColorConstants255.COLOR_CHINA;
    const result = baseColor.translateTo01();
    const color = new Color(0.965, 0.545, 0.122, 1);
    expect(result).toEqual(color);
});

test("Color translateTo255", () => {
    const baseColor = new Color(0.965, 0.545, 0.122, 1);
    const result = baseColor.translateTo255();
    const color = MyColorConstants255.COLOR_CHINA;
    expect(result).toEqual(color);
});

test("Color translateToColorCode", () => {
    const baseColor = MyColorConstants255.COLOR_CHINA;
    const result = baseColor.translateToColorCode();
    const color = "#F68B1F";
    expect(result).toEqual(color);
});
