namespace Script {
    export function initEntitiesInGrid<T extends IEntity>(_grid: GridData<string>, _entity: new (...data: any) => T): Grid<T> {
        const grid = new Grid(_grid);
        const newGrid = new Grid<T>();
        const data = Provider.data;
        grid.forEachElement((entityId, pos) => {
            if (!entityId) return;
            let entityData = data.getEntity(entityId);
            if (!entityData) throw new Error(`Entity ${entityId} not found.`);
            newGrid.set(pos, new _entity(entityData, Provider.visualizer, pos));
        })
        return newGrid;

    }

    export async function waitMS(_ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        })
    }
}