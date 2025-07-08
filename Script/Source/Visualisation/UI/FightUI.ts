/// <reference path="UILayer.ts" />

namespace Script {
    export class FightUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("Fight");
        }

        private updateRoundCounter = async (_ev: FightEvent) => {
            let round = _ev.detail.round;
            const roundCounter: HTMLDivElement = document.querySelector(".RoundCounter");
            roundCounter.innerText = `Round: ${round + 1}`;
            roundCounter.classList.add("animate");
            await waitMS(1000);
            roundCounter.classList.remove("animate");
        }

        addEventListeners(): void {
            EventBus.addEventListener(EVENT.ROUND_START, this.updateRoundCounter);
        }
        removeEventListeners(): void {
            EventBus.removeEventListener(EVENT.ROUND_START, this.updateRoundCounter);
        }

    }
}