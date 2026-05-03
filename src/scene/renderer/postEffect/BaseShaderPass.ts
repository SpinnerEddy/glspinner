import { RenderTargetOperation } from "../../../webgl/gl/fbo/RenderTargetOperation";
import { Plane } from "../../../webgl/gl/geometry/Plane";
import { MeshNode } from "../../core/node/MeshNode";
import { SceneGraphUtility } from "../../core/SceneGraphUtility";
import { BaseMaterial } from "../../material/BaseMaterial";
import { UnlitMesh } from "../../mesh/UnlitMesh";
import { RendererContext } from "../RendererContext";
import { ShaderPassOperation } from "./ShaderPassOperation";

export abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: MeshNode;
    protected isEffectEnabled: boolean = true;

    constructor(gl: WebGL2RenderingContext, material: BaseMaterial) {
        this.material = material;
        
        const planeGeometry = new Plane(gl, 2, 2);
        const planeAttributes = {
            aPosition: material.getAttribute(gl, 'aPosition'),
            aColor: material.getAttribute(gl, 'aColor'),
            aUv: material.getAttribute(gl, "aUv")
        };
        planeGeometry.setUpBuffers(gl, planeAttributes);
        const planeMesh = new UnlitMesh(planeGeometry, material);
        this.plane = new MeshNode(planeMesh);
    }

    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void;

    setEffectEnabled(enabled: boolean): void {
        this.isEffectEnabled = enabled;
    }

    getEffectEnabled(): boolean {
        return this.isEffectEnabled;
    }

    protected draw(gl: WebGL2RenderingContext, context: RendererContext, outputRenderTarget: RenderTargetOperation): void {
        outputRenderTarget.bindAsDrawTarget();

        SceneGraphUtility.traverse(this.plane, (node) => node.draw(gl, context));
    }
}