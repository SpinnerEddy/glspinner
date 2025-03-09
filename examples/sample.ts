import * as GLSpinner from '../src/index.ts';

await GLSpinner.ShaderLoader.getInstance().loadCommonShaders();

await GLSpinner.ShaderLoader.getInstance().loadShaderFromPath(
    "shader/basic.vert", 
    "shader/basic.frag");