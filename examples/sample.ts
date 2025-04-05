import * as GLSpinner from '../src/index.ts';

const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
if(canvas == null){
    console.error('Not Found Canvas!!');
}

const util = new GLSpinner.WebGLUtility(canvas);
const gl = util.getWebGL2RenderingContext();
    
const loader = new GLSpinner.ShaderLoader(gl);
await loader.loadCommonShaders();
await loader.loadShaderFromPath(
    "shader/basic.vert",
    "shader/basic.frag");

const program = loader.getShaderProgram("default");
gl.useProgram(program.getProgram());

const rect = new GLSpinner.Rectangle(gl);
var attributes = {
    aPosition: program.getAttribute('aPosition'),
    aColor: program.getAttribute('aColor')
};

rect.setUpBuffers(attributes);

let modelMatrix = GLSpinner.MatrixCalculator.identity44();
let vpMatrix = GLSpinner.MatrixCalculator.identity44();
let viewMatrix = GLSpinner.MatrixCalculator.lookAt(
    new GLSpinner.Vector3(0.0, 0.0, 3.0), 
    new GLSpinner.Vector3(0.0, 0.0, 0.0), 
    new GLSpinner.Vector3(0.0, 1.0, 0.0));
let projectionMatrix = GLSpinner.MatrixCalculator.perspective(45, canvas.width, canvas.height, 0.1, 100);
let mvpMatrix = GLSpinner.MatrixCalculator.multiply(GLSpinner.MatrixCalculator.multiply(projectionMatrix, viewMatrix), modelMatrix);

program.setUniform('mvpMatrix', new GLSpinner.ShaderUniformValue(mvpMatrix));
util.clearColor(GLSpinner.ColorUtility.hexToColor01(GLSpinner.MyColorCode.COLOR_HARUKI));

function render(){
    util.clearColor(GLSpinner.ColorUtility.hexToColor01(GLSpinner.MyColorCode.COLOR_HARUKI));
    modelMatrix = modelMatrix.rotate3D(0.05, GLSpinner.DefaultVectorConstants.AXIS2DZ, modelMatrix);
    vpMatrix = projectionMatrix.multiply(viewMatrix, vpMatrix);
    mvpMatrix = vpMatrix.multiply(modelMatrix, mvpMatrix);

    program.setUniform('mvpMatrix', new GLSpinner.ShaderUniformValue(mvpMatrix));
    rect.render();
    requestAnimationFrame(render);
}

render();