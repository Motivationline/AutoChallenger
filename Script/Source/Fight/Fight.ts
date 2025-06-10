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

        constructor(_fight: FightData, _home: Grid<IEntity>) {
            this.rounds = _fight.rounds;
            this.arena = {
                away: initEntitiesInGrid(_fight.entities, Entity),
                home: _home,
            }

        }

        getRounds() {
            return this.rounds;
        }

        async run(): Promise<void> {
            // TODO: add eventlisteners


            // run actual round
            for (let r: number = 0; r < this.rounds; r++) {
                await this.runOneSide(this.arena.home, this.arena.away);
                await this.runOneSide(this.arena.away, this.arena.home);
                // check if round is over
                if (this.arena.home.occupiedSpots === 0) {
                    return console.log("Player lost");
                }
                if (this.arena.away.occupiedSpots === 0) {
                    return console.log("Player won");
                }
                
            }
            return console.log("Player survived");
        }

        private async runOneSide(_active: Grid<IEntity>, _passive: Grid<IEntity>): Promise<void> {
            // TODO: moves

            // spells
            await _active.forEachElementAsync(async (el) => {
                if(!el) return;
                await el.useSpell(_active, _passive);
            })
            
            // attacks
            await _active.forEachElementAsync(async (el) => {
                if(!el) return;
                await el.useAttack(_active, _passive);
            })
        }

    }
}