import { Color } from '../../color/Color';
import { Light } from '../light/Light';

export class LightFactory {
    static light(color: Color, intensity: number): Light {
        return new Light(color, intensity);
    }
}
