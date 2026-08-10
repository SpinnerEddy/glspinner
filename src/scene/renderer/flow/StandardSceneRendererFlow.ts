import { BaseSceneRendererFlow } from './BaseSceneRendererFlow';
import { RendererContext } from '../RendererContext';
import { EmptyNode } from '../../core/node/EmptyNode';
import { RenderTargetOperation } from '../../../webgl/gl/fbo/RenderTargetOperation';
import { SceneGraphUtility } from '../../core/SceneGraphUtility';
import { RenderTagConstants } from '../definition/RenderTag';

export class StandardSceneRendererFlow extends BaseSceneRendererFlow {
    private sceneGraphRoot: EmptyNode;

    constructor(sceneGraphRoot: EmptyNode) {
        super();
        this.sceneGraphRoot = sceneGraphRoot;
    }

    render(gl: WebGL2RenderingContext, context: RendererContext, _inputRenderTarget: RenderTargetOperation, outputRenderTarget: RenderTargetOperation): void {
        outputRenderTarget.bindAsDrawTarget();

        if (context.getActivateRenderTag() === RenderTagConstants.OPAQUE) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        SceneGraphUtility.traverse(this.sceneGraphRoot, (node) => {
            if (!node.shouldDraw(context)) return;

            node.draw(gl, context);
        });
    }

    isEnabled(): boolean {
        return true;
    }
}
