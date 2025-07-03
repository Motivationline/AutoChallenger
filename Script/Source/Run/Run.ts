namespace Script {
    import ƒ = FudgeCore;
    /** Handles an entire run */
    export class Run {
        eumlings: Eumling[] = [];
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
            await this.runFight(nextEncounter);

            if (this.progress > this.encountersUntilBoss) {
                await EventBus.dispatchEvent({ type: EVENT.RUN_END });
                return;
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
            // TODO: prepare fight positioning etc.

            // actually run the fight
        }

        addEventListeners() {

        }

        removeEventListeners() {

        }
    }
}