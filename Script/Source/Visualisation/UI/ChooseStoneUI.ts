/// <reference path="UILayer.ts" />

namespace Script {
    export class ChooseStoneUI extends UILayer {

        optionElements: Map<HTMLElement, Stone> = new Map();
        confirmButton: HTMLButtonElement;
        selectedStone: Stone;
        constructor() {
            super();
            this.element = document.getElementById("ChooseStone");
            this.confirmButton = document.getElementById("ChooseStoneConfirm") as HTMLButtonElement;
        }

        onAdd(_zindex: number): void {
            this.removeEventListeners();
            super.onAdd(_zindex);
            this.confirmButton.disabled = true;

            const optionElement = document.getElementById("ChooseStoneOptions");
            this.optionElements.clear();
            const options = chooseRandomElementsFromArray(Provider.data.stones, 3);
            for (let opt of options) {
                let stone = new Stone(opt);
                let uiElement = StoneUIElement.getUIElement(stone);
                uiElement.element.addEventListener("click", this.clickedStone);
                this.optionElements.set(uiElement.element, stone);
                optionElement.appendChild(uiElement.element);
            }
            optionElement.replaceChildren(...this.optionElements.keys());
        }

        private clickedStone = (_ev: MouseEvent) => {
            let element = _ev.currentTarget as HTMLElement;
            let stone = this.optionElements.get(element);
            for (let elem of this.optionElements.keys()) {
                elem.classList.remove("selected");
            }
            element.classList.add("selected");
            this.selectedStone = stone;
            this.confirmButton.disabled = false;
        }


        private confirm = () => {
            if (!this.selectedStone) return;

            for (let elem of this.optionElements.keys()) {
                elem.classList.remove("selected");
            }
            Provider.GUI.removeTopmostUI();
            EventBus.dispatchEvent({ type: EVENT.CHOSEN_STONE, detail: { stone: this.selectedStone } });
        }

        addEventListeners(): void {
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners(): void {

            for (let el of this.optionElements.keys()) {
                el.removeEventListener("click", this.clickedStone);
            }
            this.confirmButton.removeEventListener("click", this.confirm);
        }

    }
}