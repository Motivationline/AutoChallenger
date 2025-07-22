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
        protected visualizer: IVisualizeFight;
        protected HUD: VisualizeGUI;

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

            this.visualizer = Provider.visualizer.getFight(this);
            this.HUD = Provider.visualizer.getHUD();

            this.addEventListeners();
        }

        getRounds() {
            return this.rounds;
        }

        async run(): Promise<FIGHT_RESULT> {
            Fight.activeFight = this;
            // Eventlisteners
            // EventBus.removeAllEventListeners();
            this.HUD.addFightListeners();//replace main.ts instance with Provider.visualizer.getHUD() instance
            this.arena.home.forEachElement((el) => { el.registerEventListeners() });
            this.arena.away.forEachElement((el) => { el.registerEventListeners() });
            //TODO: Add stones
            await this.visualizer.fightStart();
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_START });

            // run actual round
            for (let r: number = 0; r < this.rounds; r++) {
                await this.visualizer.roundStart();
                await waitMS(2000);
                await EventBus.dispatchEvent({ type: EVENT.ROUND_START, detail: { round: r } });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await EventBus.dispatchEvent({ type: EVENT.ROUND_END, detail: { round: r }});
                await this.visualizer.roundEnd();
                await move(this.arena.away as Grid<Entity>);// TODO: Call Move over an Event and Pass The Grid With it
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
            await this.visualizer.fightEnd();
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_END, detail: { result: _result } });
            Fight.activeFight = undefined;
            
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_ENDED, detail: { result: _result } });
            this.removeEventListeners();
            return _result;
        }

        private async runOneSide(_active: Grid<IEntity>, _passive: Grid<IEntity>): Promise<void> {
            // TODO: moves

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
            let deadEntity = _ev.target;
            this.arena.home.forEachElement((el, pos) => {
                if (el !== deadEntity) return;
                this.arena.home.set(pos, undefined);
            })
            this.arena.away.forEachElement((el, pos) => {
                if (el !== deadEntity) return;
                this.arena.away.set(pos, undefined);
            })
        }

        private addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_DIED, this.handleDeadEntity);
        }
        private removeEventListeners() {
            EventBus.removeEventListener(EVENT.ENTITY_DIED, this.handleDeadEntity);
        }
    }
}