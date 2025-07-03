namespace Script {
    export interface VisualizeHUD {
        sayHello(): void;
        addFightListeners(): void;
    }
    // TODO: add Provider to pass UI elements without hardcoding
    export class VisualizeHUD implements VisualizeHUD {

        constructor() {}

        sayHello(): void {
            console.log("Hello from HUD");
        }

        private roundStart = async (_ev: FightEvent) => {
            this.updateRoundCounter(_ev);
        }

        private updateRoundCounter(_ev: FightEvent) { //TODO: make private somehow
            let round = _ev.detail.round;
            const roundCounter: HTMLDivElement = document.querySelector(".RoundCounter");
            roundCounter.innerText = `Round: ${round + 1}`;
            console.log(`Update Round: ${round + 1}`);
        }

        addFightListeners() {
            EventBus.addEventListener(EVENT.ROUND_START, this.roundStart);
        }
    }
}