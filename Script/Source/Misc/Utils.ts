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
            ƒ.Time.game.setTimer(_ms, 1, () => {resolve()});
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
        if (!_array) return [];
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

    export async function getDuplicateOfNode(_node: ƒ.Node): Promise<ƒ.Node> {
        let newNode: ƒ.Node = new ƒ.Node(_node.name);
        await newNode.deserialize(_node.serialize());
        return newNode;
    }

    export function getPickableObjectsFromClientPos(_pos: ƒ.Vector2): PickSphere[] {
        const ray = viewport.getRayFromClient(_pos);
        const picks = PickSphere.pick(ray, { sortBy: "distanceToRay" });
        return picks;
    }


    export function randomString(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    export function enumToArray<T extends object>(anEnum: T): T[keyof T][] {
        return Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    }


    export function findFirstComponentInGraph<T extends ƒ.Component>(_graph: ƒ.Node, _cmp: new () => T): T {
        let foundCmp = _graph.getComponent(_cmp);
        if (foundCmp) return foundCmp;
        for (let child of _graph.getChildren()) {
            foundCmp = findFirstComponentInGraph(child, _cmp);
            if (foundCmp) return foundCmp;
        }
        return undefined;
    }

    export async function loadResourcesAndInitViewport(canvas: HTMLCanvasElement): Promise<ƒ.Viewport> {
        await ƒ.Project.loadResourcesFromHTML();

        let graphId/* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphId];
        let viewport = new ƒ.Viewport();
        let camera = findFirstComponentInGraph(graph, ƒ.ComponentCamera);

        viewport.initialize("game", graph, camera, canvas);
        return viewport;
    }

    export async function moveNodeOverTime(_node: ƒ.Node, _translationTarget: ƒ.Vector3, _rotationTarget: ƒ.Vector3, _timeMS: number): Promise<void> {
        if (!_node) return;
        let elapsedTime: number = 0;
        const translationStart: ƒ.Vector3 = _node.mtxLocal.translation.clone;
        const rotationStart: ƒ.Vector3 = _node.mtxLocal.rotation.clone;

        return new Promise<void>((resolve) => {
            const mover = () => {
                const delta = ƒ.Loop.timeFrameGame;
                elapsedTime += delta;
                if (elapsedTime > _timeMS) {
                    _node.mtxLocal.translation = _translationTarget;
                    _node.mtxLocal.rotation = _rotationTarget;
                    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, mover);
                    resolve();
                    return;
                }
                _node.mtxLocal.translation = ƒ.Vector3.LERP(translationStart, _translationTarget, elapsedTime / _timeMS);
                _node.mtxLocal.rotation = ƒ.Vector3.LERP(rotationStart, _rotationTarget, elapsedTime / _timeMS);
            };
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, mover);
        });
    }
}