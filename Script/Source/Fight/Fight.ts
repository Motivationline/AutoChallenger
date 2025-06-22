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

    export class Fight {
        rounds: number;
        arena: Arena;
        protected visualizer: IVisualizeFight;

        constructor(_fight: FightData, _home: Grid<IEntity>) {
            this.rounds = _fight.rounds;
            this.arena = {
                away: initEntitiesInGrid(_fight.entities, Entity),
                home: _home,
            }
            this.arena.home.forEachElement((el)=>{
                el?.setGrids(this.arena.home, this.arena.away);
            });
            this.arena.away.forEachElement((el)=>{
                el?.setGrids(this.arena.away, this.arena.home);
            });

            this.visualizer = Provider.visualizer.getFight(this);
        }

        getRounds() {
            return this.rounds;
        }

        async run(): Promise<void> {
            // Eventlisteners
            EventBus.removeAllEventListeners();
            this.arena.home.forEachElement((el) => { el?.registerEventListeners() });
            this.arena.away.forEachElement((el) => { el?.registerEventListeners() });
            //TODO: Add artifacts
            await this.visualizer.fightStart();
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_START });
            
            // run actual round
            for (let r: number = 0; r < this.rounds; r++) {
                await this.visualizer.roundStart();
                await EventBus.dispatchEvent({ type: EVENT.ROUND_START, value: r });
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                await EventBus.dispatchEvent({ type: EVENT.ROUND_END, value: r });
                await this.visualizer.roundEnd();
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    await this.visualizer.fightEnd();
                    await EventBus.dispatchEvent({ type: EVENT.FIGHT_END });
                    return console.log("Player lost");
                }
                if (this.arena.away.occupiedSpots === 0) {
                    await this.visualizer.fightEnd();
                    await EventBus.dispatchEvent({ type: EVENT.FIGHT_END });
                    return console.log("Player won");
                }
                
            }
            await this.visualizer.fightEnd();
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_END });
            return console.log("Player survived");
        }

        private async runOneSide(_active: Grid<IEntity>, _passive: Grid<IEntity>): Promise<void> {
            // TODO: moves

            // spells
            await _active.forEachElementAsync(async (el) => {
                if (!el) return;
                await el.useSpell(_active, _passive);
            })

            // attacks
            await _active.forEachElementAsync(async (el) => {
                if (!el) return;
                await el.useAttack(_active, _passive);
            })
        }
    }
}