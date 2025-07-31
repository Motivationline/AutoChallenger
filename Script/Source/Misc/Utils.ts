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
    
    // TODO: replace this with a fudge timeout so it scales with gametime
    // Alternatively, make a second one that does that and replace where reasonable
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

    export function randomRange(min: number = 0, max: number = 1): number {
        const range = max - min;
        return Math.random() * range + min;
    }

    export function chooseRandomElementsFromArray<T>(_array: readonly T[], _max: number, _exclude: T[] = []): T[] {
        let filteredOptions = _array.filter((element) => !_exclude.includes(element));
        if (filteredOptions.length < _max) {
            return filteredOptions;
        }

        let result: T[] = [];
        for (let i: number = 0; i < _max; i++) {
            const index = Math.floor(Math.random() * filteredOptions.length);
            result.push(...filteredOptions.splice(index, 1));
        }
        return result;
    }

    interface CreateElementAdvancedOptions {
        classes: string[],
        id: string,
        innerHTML: string,
        attributes: [string, string][],
    }
    
    export function createElementAdvanced<K extends keyof HTMLElementTagNameMap>(_type: K, _options: Partial<CreateElementAdvancedOptions> = {}): HTMLElementTagNameMap[K] {
        let el = document.createElement(_type);

        if (_options.id) {
            el.id = _options.id;
        }
        if (_options.classes) {
            el.classList.add(..._options.classes);
        }
        if (_options.innerHTML) {
            el.innerHTML = _options.innerHTML;
        }
        if (_options.attributes) {
            for (let attribute of _options.attributes) {
                el.setAttribute(attribute[0], attribute[1]);
            }
        }

        return el;
    }

    export async function getDuplicateOfNode(_node: ƒ.Node) : Promise<ƒ.Node> {
        let newNode: ƒ.Node = new ƒ.Node(_node.name);
        await newNode.deserialize(_node.serialize());
        return newNode;
    }
}