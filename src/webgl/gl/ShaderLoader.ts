import { ShaderProgram } from "./ShaderProgram";

export class ShaderLoader{
    private gl: WebGL2RenderingContext;
    private commonProgramCache: Map<string, ShaderProgram> = new Map();
    private programKey: Set<string> = new Set();

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
    }

    public async loadShaderFromPath(vertShaderPath: string, fragShaderPath: string): Promise<void> {
        const vertShaderSource = await this.loadShader(vertShaderPath);
        const fragShaderSource = await this.loadShader(fragShaderPath);
        let shaderKey = fragShaderPath.split('/').pop()?.split('.').shift() as string;

        let program = new ShaderProgram(this.gl, vertShaderSource, fragShaderSource);
        this.commonProgramCache.set(shaderKey, program);
        
        console.log("loadShaderFromPath done");
        console.log(this.commonProgramCache);
    }

    public async loadCommonShaders(): Promise<void> {
        const vertShaderFiles = import.meta.glob('@webgl/shader/*.vert', {query: '?raw', eager: true});
        const fragShaderFiles = import.meta.glob('@webgl/shader/*.frag', {query: '?raw', eager: true});

        const vertexShaderCache: Map<string, string> = new Map();
        const fragmentShaderCache: Map<string, string> = new Map();

        Object.entries(vertShaderFiles).forEach(([filePath, module]) => {
            const content = (module as { default: string }).default;
            const shaderKey = filePath.split('/').pop()?.split('.').shift()!;
            vertexShaderCache.set(shaderKey, content as string);
            this.programKey.add(shaderKey);
        });
        
        Object.entries(fragShaderFiles).forEach(([filePath, module]) => {
            const content = (module as { default: string }).default;
            const shaderKey = filePath.split('/').pop()?.split('.').shift()!;
            fragmentShaderCache.set(shaderKey, content as string);
            this.programKey.add(shaderKey);
        });

        for (const key of this.programKey) {
            console.log(key);
            let vertexShaderSource = vertexShaderCache.get(key) as string;
            let fragmentShaderSource = fragmentShaderCache.get(key) as string;
            if (!vertexShaderSource || !fragmentShaderSource) {
                console.warn(`Shader pair incomplete for key: ${key}`);
                continue;
            }
            let program = new ShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
            this.commonProgramCache.set(key, program);
        }

        console.log("loadCommonShaders done");
        console.log(this.commonProgramCache);
    }

    async loadShader(path: string): Promise<string>{
        try {
            const response = await fetch(path);
            const shaderSource = await response.text();
            return shaderSource as string;
        } catch (error) {
            console.error(error);
            throw new Error('Cannot load shader!!');
        }
    }
}