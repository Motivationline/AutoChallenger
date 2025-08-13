/// <reference path="UILayer.ts" />

namespace Script {
    export class MapUI extends UILayer {
        submitBtn: HTMLButtonElement;
        optionButton: HTMLElement;
        optionElements: HTMLElement[];
        selectedEncounter: number;
        hill: HTMLElement;
        constructor() {
            super();
            this.element = document.getElementById("Map");
            this.submitBtn = document.getElementById("MapActionButton") as HTMLButtonElement;
            this.optionButton = document.getElementById("MapOptionButton");
            this.hill = document.getElementById("MapHill");
        }

        async onAdd(_zindex: number, _ev: FightEvent): Promise<void> {
            super.onAdd(_zindex);
            this.updateProgress();
            this.displayEncounters(_ev);
            this.element.classList.remove("no-interact");
            this.hill.dataset.selected = "";
            this.submitBtn.classList.add("hidden");
            document.getElementById("MapHeader").appendChild(GoldDisplayElement.element);
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
                elem.dataset.type = option.toString();
                elem.addEventListener("click", () => {
                    for (let opt of this.optionElements) {
                        opt.classList.remove("selected");
                    }
                    elem.classList.add("selected");
                    this.selectedEncounter = option;
                    this.submitBtn.disabled = false;
                    this.submitBtn.classList.remove("hidden");
                    this.hill.dataset.selected = this.optionElements.indexOf(elem).toString();

                    if (option < 0) {
                        // shop
                        this.submitBtn.innerText = "Shop";
                    } else {
                        this.submitBtn.innerText = "Battle";
                    }

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
                    opt.classList.add("center");
                } else {
                    opt.classList.add("remove");
                }
            }
            this.optionElements.find((el) => el.classList.contains("selected"));
            this.element.classList.add("no-interact");
            await waitMS(1000);
            EventBus.dispatchEvent({ type: EVENT.CHOSEN_ENCOUNTER, detail: { encounter: this.selectedEncounter } });
        }

        private click = (_ev: MouseEvent) => {
            if (this.optionElements.includes(_ev.target as HTMLElement)) return;
            if (_ev.target === this.submitBtn) return;
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add("hidden");
            this.hill.dataset.selected = "";
            for (let opt of this.optionElements) {
                opt.classList.remove("selected");
            }
            this.selectedEncounter = undefined;
        }

        private openOptions = (_ev: MouseEvent) => {
            Provider.GUI.addUI("options");
        }

        addEventListeners(): void {
            this.submitBtn.addEventListener("click", this.selectionDone);
            this.optionButton.addEventListener("click", this.openOptions);
            document.getElementById("Map").addEventListener("click", this.click)
        }
        removeEventListeners(): void {
            this.submitBtn.removeEventListener("click", this.selectionDone);
            this.optionButton.removeEventListener("click", this.openOptions);
            document.getElementById("Map").removeEventListener("click", this.click)
        }

    }
}