/// <reference path="UILayer.ts" />

namespace Script {
    export class MapUI extends UILayer {
        submitBtn: HTMLButtonElement;
        optionElements: HTMLElement[];
        selectedEncounter: number;
        constructor() {
            super();
            this.element = document.getElementById("Map");
            this.submitBtn = document.getElementById("MapActionButton") as HTMLButtonElement;
        }

        onAdd(_zindex: number, _ev: FightEvent): void {
            super.onAdd(_zindex);
            this.updateProgress();
            this.displayEncounters(_ev);
            this.element.classList.remove("no-interact");
        }

        private updateProgress() {
            const inner = document.getElementById("MapProgressBarCurrent");
            const progress = Run.currentRun.progress / Run.currentRun.encountersUntilBoss;
            inner.style.height = progress * 100 + "";
        }
        private displayEncounters(_ev: FightEvent) {
            let options: number[] = _ev.detail.options;
            this.optionElements = [];
            for (let option of options) {
                const elem = createElementAdvanced("div", { classes: ["MapOption"] });
                if (option < 0) {
                    // shop
                    elem.innerText = "Shop";
                } else {
                    elem.innerText = `Fight lvl ${option + 1}`;
                }
                elem.addEventListener("click", () => {
                    for (let opt of this.optionElements) {
                        opt.classList.remove("selected");
                    }
                    elem.classList.add("selected");
                    this.selectedEncounter = option;
                    this.submitBtn.disabled = false;
                })
                this.optionElements.push(elem);
            }

            document.getElementById("MapOptions").replaceChildren(...this.optionElements);
            this.submitBtn.disabled = true;
        }

        private selectionDone = async () => {
            this.submitBtn.disabled = true;
            for (let opt of this.optionElements) {
                if (opt.classList.contains("selected")) {
                    opt.classList.add("center")
                } else {
                    opt.classList.add("remove");
                }
            }
            this.optionElements.find((el) => el.classList.contains("selected"));
            this.element.classList.add("no-interact");
            await waitMS(1000);
            EventBus.dispatchEvent({type: EVENT.CHOSEN_ENCOUNTER, detail: {encounter: this.selectedEncounter}});
        }

        addEventListeners(): void {
            this.submitBtn.addEventListener("click", this.selectionDone);
        }
        removeEventListeners(): void {
        }

    }
}