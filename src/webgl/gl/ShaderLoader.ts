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
        const vertShaderFiles = import.meta.glob('@webgl/shader/*.vert', {query: '?raw', import: 'default'});
        const fragShaderFiles = import.meta.glob('@webgl/shader/*.frag', {query: '?raw', import: 'default'});

        const vertexShaderCache: Map<string, string> = new Map();
        const fragmentShaderCache: Map<string, string> = new Map();

        await Promise.all([
            ...Object.entries(vertShaderFiles).map(async ([filePath, importer]) => {
                const content = await importer() as string;
                const shaderKey = filePath.split('/').pop()?.split('.').shift()!;
                vertexShaderCache.set(shaderKey, content);
                this.programKey.add(shaderKey);
            }),
            ...Object.entries(fragShaderFiles).map(async ([filePath, importer]) => {
                const content = await importer() as string;
                const shaderKey = filePath.split('/').pop()?.split('.').shift()!;
                fragmentShaderCache.set(shaderKey, content);
                this.programKey.add(shaderKey);
            }),
        ]);

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