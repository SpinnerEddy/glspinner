import { Color } from "./Color";
import { Color255 } from "./Color255";

export const DefaultColorConstants = 
{
    RED: new Color(1, 0, 0),
    GREEN: new Color(0, 1, 0),
    BLUE: new Color(0, 0, 1),
    WHITE: new Color(1, 1, 1),
    BLACK: new Color(0, 0, 0)
}

export const MyColorConstants255 =
{
    COLOR_EMPTY: new Color255(0, 0, 0, 0),

    COLOR_SUBARU: new Color255(174, 180, 156, 255),

    COLOR_NOCTCHILL: new Color255(56, 77, 152, 255),
    COLOR_TORU: new Color255(80, 208, 208, 255),
    COLOR_MADOKA: new Color255(190, 30, 62, 255),
    COLOR_KOITO: new Color255(121, 103, 195, 255),
    COLOR_HINANA: new Color255(255, 198, 57, 255),
    COLOR_HARUKI: new Color255(234, 215, 164, 255),

    COLOR_CHINA: new Color255(246, 139, 31, 255),
    COLOR_SENA: new Color255(246, 174, 84, 255),
    COLOR_LILJA: new Color255(234, 253, 255, 255),
    COLOR_SUMIKA: new Color255(124, 252, 0, 255)
}

export const MyColorCode =
{
    COLOR_EMPTY: '#000000',

    COLOR_SUBARU: '#aeb49c',

    COLOR_NOCTCHILL: '#384d98',
    COLOR_TORU: '#50d0d0',
    COLOR_MADOKA: '#be1e3e',
    COLOR_KOITO: '#7967c3',
    COLOR_HINANA: '#ffc639',
    COLOR_HARUKI: '#ead7a4',

    COLOR_CHINA: '#f68b1f',
    COLOR_SENA: '#f6ae54',
    COLOR_LILJA: '#eafdff',
    COLOR_SUMIKA: '#7cfc00'
}