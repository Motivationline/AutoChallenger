namespace Script {

    /** Handles an entire run */
    export class Run {
        static currentRun: Run;
        eumlings: Eumling[] = [];
        stones: Stone[] = [];
        progress: number = 0;
        encountersUntilBoss: number = 10;
        #gold: number = 0;
        #currentFight: Fight;
        /* TODO: This is a crutch for now, later we might come up with a better solution than hardcoding all encounter chances for each level */
        #levelDifficultyChances: number[][] = [
            [1, 0, 0],
            [0.9, 0.1, 0],
            [0.8, 0.2, 0],
            [0.7, 0.3, 0],
            [0.6, 0.3, 0.1],
            [0.5, 0.3, 0.2],
            [0.4, 0.3, 0.3],
            [0.2, 0.4, 0.4],
            [0, 0.5, 0.5],
            [0, 0, 1],
        ]
        #shopChance: number[] =
            [
                1,
                0,
                1,
                0,
                0.25,
                0.25,
                0.25,
                0,
                1,
                0,
            ];

        constructor() {
            this.addEventListeners();
        }

        get gold() {
            return this.#gold;
        }

        async changeGold(_amt: number) {
            // if (this.#gold < -_amt) throw new Error("Can't spend more than you have!");
            this.#gold = Math.max(0, this.#gold + _amt);
            await EventBus.dispatchEvent({ type: EVENT.GOLD_CHANGE, detail: { amount: this.#gold } })
        }

        //#region Prepare Run
        async start() {
            Run.currentRun = this;
            await EventBus.dispatchEvent({ type: EVENT.RUN_PREPARE });

            await this.chooseEumling();

            await this.chooseStone();

            await EventBus.dispatchEvent({ type: EVENT.RUN_START });

            for (this.progress = 0; this.progress < this.encountersUntilBoss; this.progress++) {
                let shouldContinue = await this.runStep();
                if (!shouldContinue) return await this.end(false);
            }
            if (this.progress === this.encountersUntilBoss) {
                // bossfight here
            }

            await this.end();
        }

        private async chooseEumling() {
            EventBus.dispatchEvent({ type: EVENT.CHOOSE_EUMLING });
            let event = await EventBus.awaitSpecificEvent(EVENT.CHOSEN_EUMLING);
            this.eumlings.push(event.detail.eumling);
        }
        private async chooseStone() {
            EventBus.dispatchEvent({ type: EVENT.CHOOSE_STONE });
            await EventBus.awaitSpecificEvent(EVENT.CHOSEN_STONE);
        }

        //#endregion

        //#region Run

        private async runStep(): Promise<boolean> {
            let encounter = await this.chooseNextEncounter();
            if (encounter < 0) { //shop
                EventBus.dispatchEvent({ type: EVENT.SHOP_OPEN });
                await EventBus.awaitSpecificEvent(EVENT.SHOP_CLOSE);
                return true;
            }

            let nextFight = await this.nextEncounter(encounter);
            await this.prepareFight(nextFight);
            let result = await this.runFight();
            if (result === FIGHT_RESULT.DEFEAT) {
                return false;
            }

            await this.giveRewards();

            return true;
        }

        //#region >  Prepare Fight

        private async chooseNextEncounter() {
            const shopChance = this.#shopChance[this.progress];
            const levelChances = this.#levelDifficultyChances[this.progress];
            const options: number[] = [];
            if (Math.random() < shopChance) {
                options.push(-1);
            }
            while (options.length < 2) {
                let random = Math.random();
                for (let index = 0; index < levelChances.length; index++) {
                    const element = levelChances[index];
                    random -= element;
                    if (random <= 0) {
                        options.push(index);
                        break;
                    }
                }
            }
            EventBus.dispatchEvent({ type: EVENT.CHOOSE_ENCOUNTER, detail: { options } });
            let event = await EventBus.awaitSpecificEvent(EVENT.CHOSEN_ENCOUNTER);
            return event.detail.encounter;
        }

        async nextEncounter(_difficulty: number) {
            // _difficulty = 10;
            if (_difficulty === -1) { // shop
                return undefined;
            }
            // TODO remember which fight(s) we had last and avoid that?
            let nextFight = chooseRandomElementsFromArray(Provider.data.fights.filter((data) => data.difficulty === _difficulty), 1)[0];
            return nextFight;
        }

        async prepareFight(_fight: FightData) {
            let eumlingsGrid: Grid<Eumling> = new Grid<Eumling>();
            this.#currentFight = new Fight(_fight, eumlingsGrid);
            await EventBus.dispatchEvent({ type: EVENT.FIGHT_PREPARE, detail: { fight: this.#currentFight } });
            await EventBus.awaitSpecificEvent(EVENT.FIGHT_PREPARE_COMPLETED);
        }

        //#endregion

        //#region > Run Fight

        private async runFight() {
            // actually run the fight
            const result = await this.#currentFight.run();
            return result;
        }

        private async giveRewards() {
            // give rewards
            let gold: number = 1;
            let xp: number = 1;
            let prevEnemyAmt = this.#currentFight.enemyCountAtStart;
            let remainingEnemyAmt = this.#currentFight.arena.away.occupiedSpots;
            let defeatedEnemyAmt = prevEnemyAmt - remainingEnemyAmt;
            gold += remainingEnemyAmt;
            xp += defeatedEnemyAmt;

            await EventBus.dispatchEvent({ type: EVENT.REWARDS_OPEN, detail: { gold, xp } });
            await EventBus.awaitSpecificEvent(EVENT.REWARDS_CLOSE);

            await this.changeGold(gold);
        }
        //#endregion
        //#endregion

        async end(_success: boolean = true) {
            await EventBus.dispatchEvent({ type: EVENT.RUN_END, detail: { success: _success } });
            this.removeEventListeners();
        }

        //#region Eventlisteners

        private handleGoldAbility = async (_ev: FightEvent) => {
            if (!_ev.trigger) return;
            if ((<SpellData>_ev.trigger)?.type !== SPELL_TYPE.GOLD) return;
            let amount = (<SpellData>_ev.trigger).level ?? 1;
            await this.changeGold(amount);
        }

        private handleStoneAddition = (_ev: FightEvent<{ stone: Stone }>) => {
            let stone = _ev.detail.stone;
            if (!stone || !(stone instanceof Stone)) return;
            this.stones.push(stone);
            stone.addEventListeners();
        }

        addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_SPELL, this.handleGoldAbility)
            EventBus.addEventListener(EVENT.CHOSEN_STONE, this.handleStoneAddition);
        }

        removeEventListeners() {
            EventBus.removeEventListener(EVENT.ENTITY_SPELL, this.handleGoldAbility);
        }

        //#endregion
    }
}