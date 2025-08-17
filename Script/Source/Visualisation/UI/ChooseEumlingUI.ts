/// <reference path="UILayer.ts" />

namespace Script {
    export class ChooseEumlingUI extends UILayer {
        optionElements: Map<HTMLElement, Eumling> = new Map();
        confirmButton: HTMLButtonElement;
        infoElement: HTMLElement;
        selectedEumling: Eumling;

        constructor() {
            super();
            this.element = document.getElementById("ChooseEumling");
            this.infoElement = document.getElementById("ChooseEumlingInfo");
            this.confirmButton = document.getElementById("ChooseEumlingConfirm") as HTMLButtonElement;
        }

        async onAdd(_zindex: number): Promise<void> {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;
            this.confirmButton.classList.add("hidden");
            this.infoElement.innerHTML = "";

            const optionElement = document.getElementById("ChooseEumlingOptions");
            const options = ["R", "S"];
            this.optionElements.clear();
            for (let opt of options) {
                let eumling = new Eumling(opt);
                let uiElement = createElementAdvanced("div", {classes: ["clickable", "selectable"]}); 
                uiElement.addEventListener("click", this.clickedEumling);
                this.optionElements.set(uiElement, eumling);
                optionElement.appendChild(uiElement);
                uiElement.appendChild(EumlingUIElement.getUIElement(eumling).element);
            }
            optionElement.replaceChildren(...this.optionElements.keys());
        }

        private clickedEumling = (_ev: MouseEvent) => {
            let element = _ev.currentTarget as HTMLElement;
            let eumling = this.optionElements.get(element);
            for (let elem of this.optionElements.keys()) {
                elem.classList.remove("selected");
            }
            element.classList.add("selected");
            this.selectedEumling = eumling;
            this.confirmButton.disabled = false;
            this.confirmButton.classList.remove("hidden");
            this.infoElement.innerHTML = `
            <span class="InfoTitle">${eumling.type}</span>
            <span class="Info">${eumling.health}♥️</span>
            <span class="Info">${eumling.info}</span>`;
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