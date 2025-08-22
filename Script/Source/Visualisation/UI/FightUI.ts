/// <reference path="UILayer.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class FightUI extends UILayer {

        stoneWrapper: HTMLElement;

        constructor() {
            super();
            this.element = document.getElementById("Fight");
            this.stoneWrapper = document.getElementById("FightStones")
        }

        currentSpeed: number = 1;
        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);

            this.initStones();
            this.initProgress();
            document.getElementById("FightGoldCounterWrapper").appendChild(GoldDisplayElement.element);
            ƒ.Time.game.setScale(this.currentSpeed);
            document.documentElement.style = `--speed: ${this.currentSpeed}`;
        }

        async onRemove(): Promise<void> {
            super.onRemove();
            ƒ.Time.game.setScale(1);
            document.documentElement.style = `--speed: 1`;
        }

        progressPoints: HTMLElement[] = [];
        private initProgress() {
            const wrapper = document.getElementById("FightProgress");
            this.progressPoints.length = 0;
            for (let i: number = 0; i < Fight.activeFight.rounds; i++) {
                this.progressPoints.push(createElementAdvanced("div", { classes: ["FightProgressElement"] }));
            }
            wrapper.replaceChildren(...this.progressPoints);
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

            this.progressPoints[round].classList.add("active");
            this.progressPoints[round - 1]?.classList.remove("active");
            this.progressPoints[round - 1]?.classList.add("done");

            const overlay = document.getElementById("FightPhaseOverlay");

            overlay.classList.add("active");
            await waitMS(1000);
            overlay.classList.remove("active");
            await waitMS(500);
        }

        changeSpeed = (_ev: MouseEvent) => {
            const speed = parseInt((<HTMLElement>_ev.currentTarget).dataset.speed);
            if (!speed || isNaN(speed)) return;
            if (speed <= 0) return;
            ƒ.Time.game.setScale(speed);
            document.documentElement.style = `--speed: ${speed}`;
            this.currentSpeed = speed;

            document.getElementById("SpeedOptionNormal").classList.remove("active");
            document.getElementById("SpeedOptionFast").classList.remove("active");
            document.getElementById("SpeedOptionFastest").classList.remove("active");
            (<HTMLElement>_ev.currentTarget).classList.add("active");
        }

        addEventListeners(): void {
            EventBus.addEventListener(EVENT.ROUND_START, this.updateRoundCounter);
            document.getElementById("SpeedOptionNormal").addEventListener("click", this.changeSpeed)
            document.getElementById("SpeedOptionFast").addEventListener("click", this.changeSpeed)
            document.getElementById("SpeedOptionFastest").addEventListener("click", this.changeSpeed)
        }
        removeEventListeners(): void {
            EventBus.removeEventListener(EVENT.ROUND_START, this.updateRoundCounter);
            document.getElementById("SpeedOptionNormal").removeEventListener("click", this.changeSpeed)
            document.getElementById("SpeedOptionFast").removeEventListener("click", this.changeSpeed)
            document.getElementById("SpeedOptionFastest").removeEventListener("click", this.changeSpeed)
        }

    }
}