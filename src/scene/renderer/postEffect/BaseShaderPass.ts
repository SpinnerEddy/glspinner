import { RenderTarget } from "../../../webgl/gl/fbo/RenderTarget";
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
    protected writeRenderTarget: RenderTarget;

    constructor(gl: WebGL2RenderingContext, material: BaseMaterial, resolution: [number, number]) {
        this.writeRenderTarget = new RenderTarget(gl, resolution);
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

    abstract render(gl: WebGL2RenderingContext, context: RendererContext, inputRenderTarget: RenderTargetOperation, isBlit: boolean): RenderTargetOperation;

    protected draw(gl: WebGL2RenderingContext, context: RendererContext, isBlit: boolean): void {
        if(isBlit){
            SceneGraphUtility.traverse(this.plane, (node) => {
                node.draw(gl, context);
            });
        }
        else{
            this.writeRenderTarget.drawToFrameBuffer(() => {
                SceneGraphUtility.traverse(this.plane, (node) => {
                    node.draw(gl, context);
                });    
            });
        }
    }

}