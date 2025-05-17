export class SceneGraphNodeIdGenerator{
    private static counters: Map<string, number> = new Map();

    public static generateId(className: string): string {
        const tag = className.substring(0, className.length - 4);
        const count = this.counters.get(tag) ?? 0;
        this.counters.set(tag, count + 1);
        return `${tag}_${count}`;
    }
}