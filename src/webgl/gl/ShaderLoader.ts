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
        for (const file in vertShaderFiles) {
            const content = await vertShaderFiles[file]();
            console.log(content);
        }
        for (const file in fragShaderFiles) {
            const content = await fragShaderFiles[file]();
            console.log(content);
        }
    }
}