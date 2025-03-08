import { Matrix } from "./Matrix";
import { Matrix22 } from "./Matrix22";
import { Matrix33 } from "./Matrix33";
import { Matrix44 } from "./Matrix44";

export const MatrixClassAndSizePair: Record<number, { new (): Matrix<any> }> = 
{
    2: Matrix22,
    3: Matrix33,
    4: Matrix44
};