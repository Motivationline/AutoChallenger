namespace Script {
    import ƒ = FudgeCore;

    export function initEntitiesInGrid<T extends IEntity>(_grid: GridData<string>, _entity: new (...data: any) => T): Grid<T> {
        const grid = new Grid(_grid);
        const newGrid = new Grid<T>();
        const data = Provider.data;
        //const visualizer = Provider.visualizer;
        grid.forEachElement((entityId, pos) => {
            let entityData = data.getEntity(entityId);
            if (!entityData) throw new Error(`Entity ${entityId} not found.`);
            newGrid.set(pos, new _entity(entityData, pos));
        })
        console.log("init Grid: " + newGrid);
        return newGrid;
    }

    export async function waitMS(_ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        })
    }

    export async function getCloneNodeFromRegistry(id: string): Promise<ƒ.Node | undefined> {
        let node = DataLink.linkedNodes.get(id);
        if (!node) return undefined;

        const newNode = new ƒ.Node("");
        await newNode.deserialize(node.serialize());
        return newNode;
    }
}