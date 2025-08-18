namespace Script {

    export interface FightData {
        /** How many rounds this fight should take until it's considered "passed" even if not all enemies are defeated. */
        rounds: number,
        /** Use the string identifiers from the entities to define what goes where. */
        entities: GridData<string>,
        /** Difficulty rating for the fight. Unused for now */
        difficulty?: number,
    }

    export interface Arena {
        home: Grid<IEntity>;
        away: Grid<IEntity>;
    }

    export enum FIGHT_RESULT {
        WIN = "win",
        SURVIVE = "survive",
        DEFEAT = "defeat",
    }

    export class Fight {
        static activeFight: Fight;
        rounds: number;
        arena: Arena;
        #enemyStartCount: number;

        constructor(_fight: FightData, _home: Grid<IEntity>) {
            this.rounds = _fight.rounds;
            this.arena = {
                away: initEntitiesInGrid(_fight.entities, Entity),
                home: _home,
            }
            this.arena.home.forEachElement((el) => {
                el.setGrids(this.arena.home, this.arena.away);
            });
            this.arena.away.forEachElement((el) => {
                el.setGrids(this.arena.away, this.arena.home);
            });

            this.#enemyStartCount = this.arena.away.occupiedSpots;

            this.addEventListeners();
            Fight.activeFight = this;
        }

        get enemyCountAtStart() {
            return this.#enemyStartCount;
        }

        getRounds() {
            return this.rounds;
        }

        async run(): Promise<FIGHT_RESULT> {
            // Eventlisteners
            // EventBus.removeAllEventListeners();

            //TODO: Add stones
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_START });

            // run actual round
            for (let r: number = 0; r < this.rounds; r++) {
                await EventBus.dispatchEvent({ type: EVENT.ROUND_START, detail: { round: r } });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await EventBus.dispatchEvent({ type: EVENT.ROUND_END, detail: { round: r }});
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    return await this.fightEnd(FIGHT_RESULT.DEFEAT);
                }
                if (this.arena.away.occupiedSpots === 0) {
                    return await this.fightEnd(FIGHT_RESULT.WIN);
                }

            }
            return await this.fightEnd(FIGHT_RESULT.SURVIVE);
        }

        private async fightEnd(_result: FIGHT_RESULT): Promise<FIGHT_RESULT> {
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_END, detail: { result: _result } });
            Fight.activeFight = undefined;
            if(_result !== FIGHT_RESULT.DEFEAT && this.arena.home.occupiedSpots === 0) _result = FIGHT_RESULT.DEFEAT;

            await EventBus.dispatchEvent({ type: EVENT.FIGHT_ENDED, detail: { result: _result } });
            this.removeEventListeners();
            return _result;
        }

        private async runOneSide(_active: Grid<IEntity>, _passive: Grid<IEntity>): Promise<void> {
            // moves
            await move(_active as Grid<Entity>);
            
            // spells
            await _active.forEachElementAsync(async (el) => {
                await el.useSpell(_active, _passive);
            })

            // attacks
            await _active.forEachElementAsync(async (el) => {
                await el.useAttack(_active, _passive);
            })
        }

        private handleDeadEntity = async (_ev: FightEvent) => {
            let deadEntity = _ev.target as Entity;
            this.arena.home.forEachElement((el, pos) => {
                if (el !== deadEntity) return;
                this.arena.home.remove(pos);
            })
            this.arena.away.forEachElement((el, pos) => {
                if (el !== deadEntity) return;
                this.arena.away.remove(pos);
            })
        }


        private handleEntityChange = (_ev: FightEvent) => {
            if (_ev.type === EVENT.ENTITY_ADDED) {
                const entity = _ev.target;
                const side = _ev.detail.side;
                const pos = _ev.detail.pos;
                if (!entity || !side || !pos) return;
                let sideGrid = side === "home" ? this.arena.home : this.arena.away;
                sideGrid.set(pos, entity, true);
                entity.position = pos;
            } else if (_ev.type === EVENT.ENTITY_REMOVED) {
                const entity = _ev.target;
                if (!entity) return;
                let pos = this.arena.home.findElementPosition(entity);
                if (pos) this.arena.home.remove(pos);
                pos = this.arena.away.findElementPosition(entity);
                if (pos) this.arena.away.remove(pos);
            }

        }

        private registerEntityListeners = () => {
            this.arena.away.forEachElement(el => el.registerEventListeners());
            this.arena.home.forEachElement(el => el.registerEventListeners());
        }

        private addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_DIED, this.handleDeadEntity);
            EventBus.addEventListener(EVENT.ENTITY_ADDED, this.handleEntityChange);
            EventBus.addEventListener(EVENT.ENTITY_REMOVED, this.handleEntityChange);
            EventBus.addEventListener(EVENT.FIGHT_PREPARE_COMPLETED, this.registerEntityListeners);
        }
        private removeEventListeners() {
            EventBus.removeEventListener(EVENT.ENTITY_DIED, this.handleDeadEntity);
            EventBus.removeEventListener(EVENT.ENTITY_ADDED, this.handleEntityChange);
            EventBus.removeEventListener(EVENT.ENTITY_REMOVED, this.handleEntityChange);
            EventBus.removeEventListener(EVENT.FIGHT_PREPARE_COMPLETED, this.registerEntityListeners);
        }
    }
}