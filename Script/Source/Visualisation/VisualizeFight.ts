namespace Script {
    export interface IVisualizeFight {
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
                const entityVis = Provider.visualizer.getEntity(entity);
                awayGrid.set(pos, entityVis, true);
            });
            this.away = new VisualizeGrid(awayGrid, "away");
            let homeGrid = new Grid<VisualizeEntity>();
            _fight.arena.home.forEachElement((entity, pos) => {
                const entityVis = Provider.visualizer.getEntity(entity);
                homeGrid.set(pos, entityVis, true);
            });
            this.home = new VisualizeGrid(homeGrid, "home");

            Provider.visualizer.addToScene(this.away);
            Provider.visualizer.addToScene(this.home);
            // Provider.visualizer.drawScene();
            this.addEventListeners();
        }

        async nukeGrid(): Promise<void> {
            this.home.nuke();
            this.away.nuke();
        }

        async fightStart(): Promise<void> {
            console.log("Fight Start!");
            this.home.grid.forEachElement(el => el.addEventListeners());
            this.away.grid.forEachElement(el => el.addEventListeners());
        }

        async roundStart(): Promise<void> {
            console.log("Round Start!");
        }

        async roundEnd(): Promise<void> {
            console.log("Round End");
        }

        async fightEnd(): Promise<void> {
            // TODO @Björn clean up visible entities
            await this.nukeGrid();
            console.log("Fight End!");
            this.removeEventListeners();
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
        whereIsEntity(_entity: VisualizeEntity): VisualizeGrid {
            let found = false;
            this.home.grid.forEachElement((el) => { if (el === _entity) found = true });
            if (found) return this.home;
            this.away.grid.forEachElement((el) => { if (el === _entity) found = true });
            if (found) return this.away;
            return undefined;
        }

        addEventListeners() {
            this.#listeners.set(EVENT.FIGHT_PREPARE_COMPLETED, this.fightStart);
            this.#listeners.set(EVENT.FIGHT_ENDED, this.fightEnd);
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