export class ShaderLoader{
    private static instance: ShaderLoader | null = null;
    private static vertexShaderCache: Map<string, string> = new Map();
    private static fragmentShaderCache: Map<string, string> = new Map();

    constructor(){}

    public static getInstance(): ShaderLoader {
        if(!this.instance){
            this.instance = new ShaderLoader();
        }

        return this.instance;
    }

    public async loadShaderFromPath(vertShaderPath: string, fragShaderPath: string): Promise<void> {
        await this.loadShader(vertShaderPath, "vert");
        await this.loadShader(fragShaderPath, "frag");

        console.log("loadShaderFromPath done");
        console.log(ShaderLoader.vertexShaderCache);
        console.log(ShaderLoader.fragmentShaderCache);
    }

    public async loadCommonShaders(): Promise<void> {
        const vertShaderFiles = import.meta.glob('@webgl/shader/*.vert', {query: '?raw', import: 'default'});
        const fragShaderFiles = import.meta.glob('@webgl/shader/*.frag', {query: '?raw', import: 'default'});
        for (const filePath in vertShaderFiles) {
            const content = await vertShaderFiles[filePath]() as string;
            let shaderKey = filePath.split('/').pop()?.split('.').shift() as string;
            ShaderLoader.vertexShaderCache.set(shaderKey, content);
        }
        for (const filePath in fragShaderFiles) {
            const content = await fragShaderFiles[filePath]() as string;
            let shaderKey = filePath.split('/').pop()?.split('.').shift() as string;
            ShaderLoader.fragmentShaderCache.set(shaderKey, content);
        }

        console.log("Common shaders loaded");
        console.log(ShaderLoader.vertexShaderCache);
        console.log(ShaderLoader.fragmentShaderCache);
    }

    async loadShader(path: string, shaderType: "vert" | "frag"): Promise<void>{
        try {
            const response = await fetch(path);
            const shaderSource = await response.text();
            let shaderKey = path.split('/').pop()?.split('.').shift() as string;

            if(shaderType === "vert"){
                ShaderLoader.vertexShaderCache.set(shaderKey, shaderSource);
            }else if(shaderType === "frag"){
                ShaderLoader.fragmentShaderCache.set(shaderKey, shaderSource);
            }
        } catch (error) {
            console.error(error);
        }
    }
}