import { ShaderProgram } from "./ShaderProgram";

export class ShaderLoader{
    private gl: WebGL2RenderingContext;
    private shaderProgramCache: Map<string, ShaderProgram> = new Map();
    private shaderProgramKey: Set<string> = new Set();

    constructor(gl: WebGL2RenderingContext){
        this.gl = gl;
    }

    public getShaderProgram(key: string): ShaderProgram {
        if(!this.shaderProgramKey.has(key)){
            throw new Error(`Common program with key ${key} not found`);
        }
        
        return this.shaderProgramCache.get(key)!;
    }

    public async loadShaderFromPath(vertShaderPath: string, fragShaderPath: string, varyings: string[] = []): Promise<void> {
        const vertShaderSource = await this.loadShader(vertShaderPath);
        const fragShaderSource = await this.loadShader(fragShaderPath);
        let shaderKey = fragShaderPath.split('/').pop()?.split('.').shift() as string;

        let program = new ShaderProgram(this.gl, vertShaderSource, fragShaderSource, varyings);
        this.shaderProgramCache.set(shaderKey, program);
        this.shaderProgramKey.add(shaderKey);
        
        console.log("loadShaderFromPath done");
        console.log(this.shaderProgramCache);
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
            this.shaderProgramKey.add(shaderKey);
        });
        
        Object.entries(fragShaderFiles).forEach(([filePath, module]) => {
            const content = (module as { default: string }).default;
            const shaderKey = filePath.split('/').pop()?.split('.').shift()!;
            fragmentShaderCache.set(shaderKey, content as string);
            this.shaderProgramKey.add(shaderKey);
        });

        for (const key of this.shaderProgramKey) {
            console.log(key);
            let vertexShaderSource = vertexShaderCache.get(key) as string;
            let fragmentShaderSource = fragmentShaderCache.get(key) as string;
            if (!vertexShaderSource || !fragmentShaderSource) {
                console.warn(`Shader pair incomplete for key: ${key}`);
                continue;
            }
            let program = new ShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
            this.shaderProgramCache.set(key, program);
        }

        console.log("loadCommonShaders done");
        console.log(this.shaderProgramCache);
    }

    async loadShader(path: string): Promise<string> {
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