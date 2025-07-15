/// <reference path="UILayer.ts" />

namespace Script {
    export class FightUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("Fight");
        }

        private updateRoundCounter = async (_ev: FightEvent) => {
            let round = _ev.detail.round;
            const roundCounters = document.querySelectorAll(".RoundCounter") as NodeListOf<HTMLElement>;
            await waitMS(500);
            
            for(let roundCounter of roundCounters) {
                roundCounter.innerText = `Round: ${round + 1}`;
            }

            const overlay = document.getElementById("FightPhaseOverlay");
            
            overlay.classList.add("active");
            await waitMS(1000);
            overlay.classList.remove("active");
            await waitMS(500);
        }

        addEventListeners(): void {
            EventBus.addEventListener(EVENT.ROUND_START, this.updateRoundCounter);
        }
        removeEventListeners(): void {
            EventBus.removeEventListener(EVENT.ROUND_START, this.updateRoundCounter);
        }

    }
}