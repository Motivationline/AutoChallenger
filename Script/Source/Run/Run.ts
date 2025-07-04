namespace Script {

    /** Handles an entire run */
    export class Run {
        eumlings: Eumling[] = [];
        stones: Stone[] = [];
        progress: number = 0;
        encountersUntilBoss: number = 10;

        async start() {
            // TODO: Select Start-Eumling Properly
            let eumling: string;
            while (eumling !== "R" && eumling !== "S") {
                eumling = prompt("Which eumling you want to start with? (R or S)", "R").trim().toUpperCase();
            }
            this.eumlings.push(new Eumling(eumling));

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
            }

            // actually run the fight
            const fight = new Fight(_fight, eumlingsGrid);
            const result = await fight.run();
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