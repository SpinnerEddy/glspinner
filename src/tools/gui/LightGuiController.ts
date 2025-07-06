import { Vector3 } from "../../math/vector/Vector3";
import { GuiUtility } from "./GuiUtility";

export type LightOptions = {
    ambientColor: string,
    lightDirection: Vector3,
    eyeDirection: Vector3
}

export class LightGuiController{
    private static ambientColor: string = "#00000000";
    
    private static lightDirectionX: number = -0.5;
    private static lightDirectionY: number = 0.5;
    private static lightDirectionZ: number = 0.5;

    private static eyeDirectionX: number = 0.0;
    private static eyeDirectionY: number = 0.0;
    private static eyeDirectionZ: number = 20.0;

    static initialize(){
        GuiUtility.initialize();
        GuiUtility.addFolder("Lighting");
        GuiUtility.addColorElement(
            {ambientColor: "#00000000"}, 
            "ambientColor",
            (value: string) => {
                this.ambientColor = value;
            }
        );

        GuiUtility.addFolder("LightDirection");
        GuiUtility.addElementWithRange(
            {lightDirectionX: -0.5}, 
            "lightDirectionX",
            -1.0,
            1.0,
            (value: number) => {
                this.lightDirectionX = value;
            }
        );
        GuiUtility.addElementWithRange(
            {lightDirectionY: 0.5}, 
            "lightDirectionY",
            -1.0,
            1.0,
            (value: number) => {
                this.lightDirectionY = value;
            }
        );
        GuiUtility.addElementWithRange(
            {lightDirectionZ: 0.5}, 
            "lightDirectionZ",
            -1.0,
            1.0,
            (value: number) => {
                this.lightDirectionZ = value;
            }
        );
        GuiUtility.resetFolder();

        GuiUtility.addFolder("EyeDirection");
        GuiUtility.addElementWithRange(
            {eyeDirectionX: 0.0}, 
            "eyeDirectionX",
            0.0,
            20.0,
            (value: number) => {
                this.eyeDirectionX = value;
            }
        );
        GuiUtility.addElementWithRange(
            {eyeDirectionY: 0.0}, 
            "eyeDirectionY",
            0.0,
            20.0,
            (value: number) => {
                this.eyeDirectionY = value;
            }
        );
        GuiUtility.addElementWithRange(
            {eyeDirectionZ: 20.0}, 
            "eyeDirectionZ",
            0.0,
            20.0,
            (value: number) => {
                this.eyeDirectionZ = value;
            }
        );
        GuiUtility.resetFolder();
    }

    static get lightOptions(): LightOptions {
        return {
            ambientColor: this.ambientColor,
            lightDirection: new Vector3(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
            eyeDirection: new Vector3(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
        };
    }
}