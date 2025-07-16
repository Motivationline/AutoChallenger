namespace Script {
    export interface IVisualizeFight {
        showGrid(): Promise<void>;
        fightStart(): Promise<void>;
        roundStart(): Promise<void>;
        roundEnd(): Promise<void>;
        fightEnd(): Promise<void>;
    }

    export class VisualizeFight implements IVisualizeFight {
        home: VisualizeGrid;
        away: VisualizeGrid;
        constructor(_fight: Fight) {
            let awayGrid = new Grid<VisualizeEntity>();
            _fight.arena.away.forEachElement((entity, pos) => {
                awayGrid.set(pos, Provider.visualizer.getEntity(entity), true);
            });
            this.away = new VisualizeGrid(awayGrid, "away");
            let homeGrid = new Grid<VisualizeEntity>();
            _fight.arena.home.forEachElement((entity, pos) => {
                homeGrid.set(pos, Provider.visualizer.getEntity(entity), true);
            });
            this.home = new VisualizeGrid(homeGrid, "home");

            Provider.visualizer.addToScene(this.away);
            Provider.visualizer.addToScene(this.home);
            Provider.visualizer.drawScene();
            this.addEventListeners();
        }

        async showGrid(): Promise<void> {
            let visualizer = Provider.visualizer;

            // let grid: string[][] = [[, , , , , , ,], [], []];

            // this.#home.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][2 - pos[0]] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })
            // this.#away.grid.forEachElement((el, pos) => {
            //     if (!el) return;
            //     let entity = (<VisualizeEntity>el).getEntity();
            //     grid[pos[1]][pos[0] + 4] = `${entity.id}\n${entity.currentHealth} ♥️`;
            //     el.mtxLocal.translation = new ƒ.Vector3(pos[0], 0, pos[1]);
            // })

            // console.table(grid);
            //draw the 3D scene
            visualizer.drawScene();
        }
        async nukeGrid(): Promise<void> {
            this.home.nuke();
            this.away.nuke();
        }

        async fightStart(): Promise<void> {
            console.log("Fight Start!");
            await this.showGrid();
        }

        async roundStart(): Promise<void> {
            console.log("Round Start!");
        }

        async roundEnd(): Promise<void> {
            await this.showGrid();
            console.log("Round End");
        }

        async fightEnd(): Promise<void> {
            // TODO @Björn clean up visible entities
            await this.nukeGrid();
            console.log("Fight End!");
        }

        entityAdded(_ev: FightEvent) {
            const entity = _ev.target;
            const side = _ev.detail.side;
            const pos = _ev.detail.pos;
            if (!entity || !side || !pos) return;

            let sideGrid = side === "home" ? this.home : this.away;
            sideGrid.addEntityToGrid(Provider.visualizer.getEntity(entity), pos);
        }
        entityRemoved(_ev: FightEvent) {
            const entity = _ev.target;
            if (!entity) return;
            let entityVis = Provider.visualizer.getEntity(entity);
            let pos = this.home.grid.findElementPosition(entityVis);
            if (pos) this.home.removeEntityFromGrid(pos);
            pos = this.away.grid.findElementPosition(entityVis);
            if (pos) this.away.removeEntityFromGrid(pos);
        }

        addEventListeners() {
            this.#listeners.set(EVENT.FIGHT_START, this.fightStart);
            this.#listeners.set(EVENT.FIGHT_END, this.fightEnd);
            this.#listeners.set(EVENT.ROUND_START, this.roundStart);
            this.#listeners.set(EVENT.ROUND_END, this.roundEnd);
            this.#listeners.set(EVENT.ENTITY_ADDED, this.entityAdded);
            this.#listeners.set(EVENT.ENTITY_REMOVED, this.entityRemoved);
            this.#listeners.set(EVENT.ENTITY_DIED, this.entityRemoved);

            for (let [event] of this.#listeners) {
                EventBus.addEventListener(event, this.eventListener);
            }
        }

        removeEventListeners() {
            for (let [event] of this.#listeners) {
                EventBus.removeEventListener(event, this.eventListener);
            }
        }

        #listeners: Map<EVENT, FightEventListener> = new Map();
        eventListener = (_ev: FightEvent) => {
            this.#listeners.get(_ev.type)?.call(this, _ev);
        }

    }
}