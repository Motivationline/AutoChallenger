/// <reference path="UIElement.ts" />


namespace Script {
    export class GoldDisplayElement extends UIElement {
        static #element: HTMLElement = createElementAdvanced("div", {
            classes: ["GoldDisplay"],
            innerHTML: "0",
        });
        static instance = new GoldDisplayElement();

        private constructor() {
            super();
            this.addEventListeners();
        }

        public static get element() {
            return this.#element;
        }

        private update = (_ev: FightEvent) => {
            GoldDisplayElement.#element.innerText = Run.currentRun.gold.toString();
        }

        addEventListeners() {
            // TODO: when to remove these listeners?
            EventBus.addEventListener(EVENT.GOLD_CHANGE, this.update);
        }
    }
}