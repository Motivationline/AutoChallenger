namespace Script {

    /** Handles an entire run */
    export class Run {
        static currentRun: Run;
        eumlings: Eumling[] = [];
        stones: Stone[] = [];
        progress: number = 0;
        encountersUntilBoss: number = 10;
        #gold: number = 0;

        get gold() {
            return this.#gold;
        }

        changeGold(_amt: number) {
            if (this.#gold < -_amt) throw new Error("Can't spend more than you have!");
            this.#gold += _amt;
            EventBus.dispatchEvent({ type: EVENT.GOLD_CHANGE, detail: { amount: this.#gold } })
        }

        async start() {
            Run.currentRun = this;
            // TODO: Proper UI
            let eumling: string;
            while (eumling !== "R" && eumling !== "S") {
                eumling = prompt("Which eumling you want to start with? (R or S)", "R").trim().toUpperCase();
            }
            this.eumlings.push(new Eumling(eumling));
            
            let stonesToChooseFrom = chooseRandomElementsFromArray(Provider.data.stones, 3);
            let chosenStone: number = -1;
            while(isNaN(chosenStone) || chosenStone < 0 || chosenStone >= stonesToChooseFrom.length){
                chosenStone = parseInt(prompt(`Choose a stone to start with.\n${stonesToChooseFrom.reduce((prev, current, index) => prev + `${index}: ${current.id}\n`, "")}`));
            }
            this.stones.push(new Stone(stonesToChooseFrom[chosenStone]));

            await EventBus.dispatchEvent({ type: EVENT.RUN_START });

            await this.nextStep();
        }

        async nextStep() {
            this.progress++;
            let nextEncounter = await this.chooseNext();
            const result = await this.runFight(nextEncounter);
            if (result === FIGHT_RESULT.DEFEAT) {
                return this.end();
            }

            if (this.progress > this.encountersUntilBoss) {
                return this.end();
            }
            await this.nextStep();
        }

        async chooseNext() {
            // TODO: replace this with a proper selection system, for now you can directly choose only fights
            let chosenFight: number = -1;
            if (this.progress === this.encountersUntilBoss) { chosenFight = 0 }
            const fights = Provider.data.fights;
            while (isNaN(chosenFight) || chosenFight < 0 || chosenFight >= fights.length) {
                chosenFight = parseInt(prompt(`Next fight id (0 - ${fights.length - 1})`));
            }
            return fights[chosenFight];
        }

        async runFight(_fight: FightData) {
            // TODO: proper prepare fight positioning etc. This here is just a temp solution
            let eumlingsGrid: Grid<Eumling> = new Grid<Eumling>();
            for (let eumling of this.eumlings) {
                let pos: Position = [-1, -1];
                while (Grid.outOfBounds(pos)) {
                    let input = prompt(`Where do you want to put your ${eumling.id}? Format: x,y, but x-mirrored!`, "1,1");
                    let split = input.split(",");
                    if (split.length !== 2) continue;
                    let newPos: Position = [parseInt(split[0]), parseInt(split[1])];
                    if (isNaN(newPos[0]) || isNaN(newPos[1])) continue;
                    pos = newPos;
                }
                eumlingsGrid.set(pos, eumling);
                eumling.position = pos;
            }

            // actually run the fight
            const fight = new Fight(_fight, eumlingsGrid);
            const result = await fight.run();

            if (result === FIGHT_RESULT.DEFEAT) {
                return result;
            }

            // give rewards
            let gold: number = 1;
            let xp: number = 1;
            let oldFightData = new Grid(_fight.entities);
            let prevEnemyAmt = oldFightData.occupiedSpots;
            let remainingEnemyAmt = fight.arena.away.occupiedSpots;
            let defeatedEnemyAmt = prevEnemyAmt - remainingEnemyAmt;
            gold += remainingEnemyAmt;
            xp += defeatedEnemyAmt;

            this.changeGold(gold);

            while (xp > 0) {
                let index = NaN;
                while (isNaN(index) || index < 0 || index >= this.eumlings.length) {
                    index = parseInt(prompt(`You have ${xp} xp to distribute. Which Eumling do you want to give it to?\n${this.eumlings.reduce((prev, current, index) => prev + `${index}: ${current.type} (${current.xp} / ${current.requiredXPForLevelup} xp)\n`, "")}`));
                }

                let eumling = this.eumlings[index];
                eumling.addXP(1);
                xp--;
            }

            return result;
        }

        async end() {
            await EventBus.dispatchEvent({ type: EVENT.RUN_END });
        }

        addEventListeners() {

        }

        removeEventListeners() {

        }
    }
}