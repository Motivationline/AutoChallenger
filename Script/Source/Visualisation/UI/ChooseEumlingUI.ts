/// <reference path="UILayer.ts" />

namespace Script {
    export class ChooseEumlingUI extends UILayer {
        optionElements: Map<HTMLElement, Eumling> = new Map();
        confirmButton: HTMLButtonElement;
        selectedEumling: Eumling;

        constructor() {
            super();
            this.element = document.getElementById("ChooseEumling");
            this.confirmButton = document.getElementById("ChooseEumlingConfirm") as HTMLButtonElement;
        }

        onAdd(_zindex: number): void {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;

            const optionElement = document.getElementById("ChooseEumlingOptions");
            const options = ["R", "S"];
            this.optionElements.clear();
            for (let opt of options) {
                let eumling = new Eumling(opt);
                let uiElement = EumlingUIElement.getUIElement(eumling);
                uiElement.element.addEventListener("click", this.clickedEumling);
                this.optionElements.set(uiElement.element, eumling);
                optionElement.appendChild(uiElement.element);
            }
            optionElement.replaceChildren(...this.optionElements.keys());
        }

        private clickedEumling = (_ev: MouseEvent) => {
            let element = _ev.target as HTMLElement;
            let eumling = this.optionElements.get(element);
            for (let elem of this.optionElements.keys()) {
                elem.classList.remove("selected");
            }
            element.classList.add("selected");
            this.selectedEumling = eumling;
            this.confirmButton.disabled = false;
        }

        private confirm = () => {
            if (!this.selectedEumling) return;

            for(let elem of this.optionElements.keys()) {
                elem.classList.remove("selected");
            }
            Provider.GUI.removeTopmostUI();
            EventBus.dispatchEvent({ type: EVENT.CHOSEN_EUMLING, detail: { eumling: this.selectedEumling } });

        }

        addEventListeners(): void {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners(): void {
            for (let el of this.optionElements.keys()) {
                el.removeEventListener("click", this.clickedEumling);
            }
            this.confirmButton.removeEventListener("click", this.confirm);
        }

    }
}