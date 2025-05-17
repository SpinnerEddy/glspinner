import { SceneGraphNodeIdGenerator } from "../../src/scene/core/SceneGraphNodeIdGenerator";

test("GenerateTest", () => {
    let id = SceneGraphNodeIdGenerator.generateId("EmptyNode");
    
    let except = "Empty_0";
    expect(id).toEqual(except);

    id = SceneGraphNodeIdGenerator.generateId("EmptyNode");
    
    except = "Empty_1";
    expect(id).toEqual(except);

    id = SceneGraphNodeIdGenerator.generateId("EmptyNode");
    
    except = "Empty_2";
    expect(id).toEqual(except);

    id = SceneGraphNodeIdGenerator.generateId("MeshNode");
    
    except = "Mesh_0";
    expect(id).toEqual(except);
});