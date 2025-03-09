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
}