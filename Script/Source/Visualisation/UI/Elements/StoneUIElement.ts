/// <reference path="UIElement.ts" />


namespace Script {
    export class StoneUIElement extends UIElement {
        #element: HTMLElement;
        #stone: Stone;

        private constructor(_stone: Stone) {
            super();
            this.#stone = _stone;
            this.#element = createElementAdvanced("div", {
                classes: ["StoneUIElement"],
            });
            this.update();
            this.addEventListeners();
        }
        static #elements: Map<Stone, StoneUIElement> = new Map();
        static getUIElement(_obj: Stone) {
            if (!this.#elements.has(_obj)) {
                this.#elements.set(_obj, new StoneUIElement(_obj));
            }
            return this.#elements.get(_obj);
        }

        get element() {
            return this.#element;
        }

        get stone() {
            return this.#stone;
        }

        private update = () => {
            this.#element.innerHTML = `
            <span class="">${this.#stone.id}</span>
            <span class="">Level ${this.#stone.level + 1}</span>
            `;
        }

        private animate = async (_ev: FightEvent) => {
            if(_ev.cause !== this.#stone) return;
            this.#element.classList.add("animate");
            await waitMS(1000);
            this.#element.classList.remove("animate");
        }

        addEventListeners() {
            // TODO: when to remove these listeners?
            EventBus.addEventListener(EVENT.TRIGGER_ABILITY, this.animate);
        }
    }
}