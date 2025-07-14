/// <reference path="UILayer.ts" />

namespace Script {
    export class ChooseStoneUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("ChooseStone");
        }

        onAdd(_zindex: number): void {
            super.onAdd(_zindex);

            const optionElement = document.getElementById("ChooseStoneOptions");
            optionElement.replaceChildren();

            const options = chooseRandomElementsFromArray(Provider.data.stones, 3);
            for (let opt of options) {
                const btn = document.createElement("button");
                btn.dataset.eumling = opt.id;
                btn.innerText = opt.id;
                optionElement.appendChild(btn);
                btn.addEventListener("click", () => {
                    Provider.GUI.removeTopmostUI();
                    EventBus.dispatchEvent({ type: EVENT.CHOSEN_STONE, detail: { stone: opt } });
                });
            }
        }

        addEventListeners(): void {
        }
        removeEventListeners(): void {
        }

    }
}