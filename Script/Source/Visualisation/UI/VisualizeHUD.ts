namespace Script {
    export interface VisualizeHUD {
        updateRoundCounter(_ev: FightEvent): void;
    }
    // TODO: add Provider to pass UI elements without hardcoding
    export class VisualizeHUD implements VisualizeHUD {

        constructor() {
            EventBus.addEventListener(EVENT.FIGHT_START, this.fightStart)
        }

        private fightStart = async (_ev: FightEvent) => {
            await this.updateRoundCounter(_ev);
        }

        updateRoundCounter(_ev: FightEvent) { //TODO: make private somehow
            let round = _ev.value;
            const roundCounter: HTMLDivElement = document.querySelector("#RoundCounter");
            roundCounter.innerText = `Round: ${round + 1}`;
        }
    }
}