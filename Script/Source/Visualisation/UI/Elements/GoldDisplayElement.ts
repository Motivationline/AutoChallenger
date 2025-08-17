/// <reference path="UIElement.ts" />


namespace Script {
    export class GoldDisplayElement extends UIElement {
        static #element: HTMLElement = createElementAdvanced("div", {
            classes: ["GoldDisplay"],
        });
        static #innerElement: HTMLElement = createElementAdvanced("span", { innerHTML: "0" });
        static #popovers: HTMLElement = createElementAdvanced("div", { classes: ["GoldDisplayPopovers"] });
        static instance = new GoldDisplayElement();

        private constructor() {
            super();
            GoldDisplayElement.#element.appendChild(GoldDisplayElement.#innerElement);
            GoldDisplayElement.#element.appendChild(GoldDisplayElement.#popovers);
            this.addEventListeners();
        }

        public static get element() {
            return this.#element;
        }

        private update = (_ev: FightEvent) => {
            GoldDisplayElement.#innerElement.innerText = Run.currentRun.gold.toString();

            const popup = createElementAdvanced("div", {
                innerHTML: `${_ev.detail.change}`,
                classes: ["GoldDisplayPopover", Math.sign(_ev.detail.change) > 0 ? "positive" : "negative"],
            });

            GoldDisplayElement.#popovers.appendChild(popup);

            setTimeout(() => { popup.remove(); }, 2000);
        }

        addEventListeners() {
            // TODO: when to remove these listeners?
            EventBus.addEventListener(EVENT.GOLD_CHANGE, this.update);
        }
    }
}