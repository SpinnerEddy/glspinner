import * as GLSpinner from '../src/index.ts';

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
if(canvas == null){
    console.error('Not Found Canvas!!');
}

const util = new GLSpinner.WebGLUtility(canvas);
util.clearColor(GLSpinner.ColorUtility.hexToColor01(GLSpinner.MyColorCode.COLOR_SENA));
const gl = util.getWebGL2RenderingContext();
    
const loader = new GLSpinner.ShaderLoader(gl);
await loader.loadCommonShaders();
await loader.loadShaderFromPath(
    "shader/basic.vert",
    "shader/basic.frag");