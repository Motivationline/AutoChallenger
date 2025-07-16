/// <reference path="UILayer.ts" />

namespace Script {
    export class FightUI extends UILayer {
        
        stoneWrapper: HTMLElement;

        constructor() {
            super();
            this.element = document.getElementById("Fight");
            this.stoneWrapper = document.getElementById("FightStones")
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);

            this.initStones();
        }


        private initStones() {
            const stones: HTMLElement[] = [];
            for (let stone of Run.currentRun.stones) {
                stones.push(StoneUIElement.getUIElement(stone).element);
            }
            this.stoneWrapper.replaceChildren(...stones);
        }

        private updateRoundCounter = async (_ev: FightEvent) => {
            let round = _ev.detail.round;
            const roundCounters = document.querySelectorAll(".RoundCounter") as NodeListOf<HTMLElement>;
            await waitMS(500);

            for (let roundCounter of roundCounters) {
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