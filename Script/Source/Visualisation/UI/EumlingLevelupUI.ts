/// <reference path="UILayer.ts" />

namespace Script {
    export class EumlingLevelupUI extends UILayer {
        eumling: Eumling;
        eumlingElement: HTMLElement;
        optionsElement: HTMLElement;
        infoElement: HTMLElement;
        confirmButton: HTMLButtonElement;
        selectedOption: string;

        static orientationInfo: Map<string, string> = new Map([
            ["R", "Realistic"],
            ["I", "Investigating"],
            ["A", "Artistic"],
            ["S", "Social"],
            ["E", "Enterprising"],
            ["C", "Conventional"],
        ])

        constructor() {
            super();
            this.element = document.getElementById("EumlingLevelup");
            this.eumlingElement = document.getElementById("EumlingLevelupEumling");
            this.optionsElement = document.getElementById("EumlingLevelupOptions");
            this.infoElement = document.getElementById("EumlingLevelupInfo");
            this.confirmButton = document.getElementById("EumlingLevelupConfirm") as HTMLButtonElement;
        }

        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);
            this.confirmButton.classList.add("hidden");
            this.eumling = _ev.target as Eumling;

            let specialisationOptions: string[] = this.eumling.types.length === 1 ? ["A", "I"] : ["C", "E"];

            this.eumlingElement.replaceChildren(EumlingUIElement.getUIElement(this.eumling).element);

            const optionElements: HTMLElement[] = [];
            for (let option of specialisationOptions) {
                const elem = createElementAdvanced("div", {
                    classes: ["LevelupOption", "selectable", "clickable"],
                    innerHTML: `<span class="LevelupLetter">+ ${option}</span>
                    <span>${EumlingLevelupUI.orientationInfo.get(option)}</span>`,
                    attributes: [["data-option", option]],
                });
                optionElements.push(elem);
                elem.addEventListener("click", (_ev: MouseEvent) => {
                    this.selectOption(_ev);

                    const newEumlingType: string = this.eumling.types.join("") + option + "-Eumling";
                    this.infoElement.innerText = Provider.data.getEntity(newEumlingType).info;
                });
            }

            this.optionsElement.replaceChildren(...optionElements);
        }

        private selectOption = (_ev: MouseEvent) => {
            const element = _ev.currentTarget as HTMLElement;
            this.selectedOption = element.dataset.option;
            this.confirmButton.classList.remove("hidden");
            for (let element of document.querySelectorAll(".LevelupOption")) {
                element.classList.remove("selected");
            }
            element.classList.add("selected");
        }

        private confirm = () => {
            if (!this.selectedOption) return;
            Provider.GUI.removeTopmostUI();
            EventBus.dispatchEvent({ type: EVENT.EUMLING_LEVELUP_CHOSEN, detail: { type: this.selectedOption } });
        }

        addEventListeners(): void {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners(): void {
            this.confirmButton.removeEventListener("click", this.confirm)
        }

    }
}