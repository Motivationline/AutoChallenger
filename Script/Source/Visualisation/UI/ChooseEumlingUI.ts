/// <reference path="UILayer.ts" />

namespace Script {
    export class ChooseEumlingUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("ChooseEumling");
        }

        onAdd(_zindex: number): void {
            super.onAdd(_zindex);

            const optionElement = document.getElementById("ChooseEumlingOptions");
            optionElement.replaceChildren();

            const options = ["R", "S"];
            for (let opt of options) {
                const btn = document.createElement("button");
                btn.dataset.eumling = opt;
                btn.innerText = opt;
                optionElement.appendChild(btn);
                btn.addEventListener("click", () => {
                    Provider.GUI.removeTopmostUI();
                    EventBus.dispatchEvent({ type: EVENT.CHOSEN_EUMLING, detail: { eumling: opt } });
                });
            }
        }

        addEventListeners(): void {
        }
        removeEventListeners(): void {
        }

    }
}