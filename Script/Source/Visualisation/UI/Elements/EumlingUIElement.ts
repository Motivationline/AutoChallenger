/// <reference path="UIElement.ts" />


namespace Script {
    export class EumlingUIElement extends UIElement {
        #element: HTMLElement;
        #eumling: Eumling;

        private constructor(_eumling: Eumling) {
            super();
            this.#eumling = _eumling;
            this.#element = createElementAdvanced("div", {
                classes: ["EumlingUIElement"],
            });
            this.update();
            this.addEventListeners();
        }
        static #elements: Map<Eumling, EumlingUIElement> = new Map();
        static getUIElement(_obj: Eumling) {
            if (!this.#elements.has(_obj)) {
                this.#elements.set(_obj, new EumlingUIElement(_obj));
            }
            return this.#elements.get(_obj);
        }

        get element() {
            return this.#element;
        }

        get eumling() {
            return this.#eumling;
        }

        private update = () => {
            this.#element.innerHTML = `
            <span class="">${this.#eumling.type}</span>
            <span class="">${this.#eumling.currentHealth} / ${this.#eumling.health}♥️</span>
            <span class="">(${this.#eumling.xp} / ${this.#eumling.requiredXPForLevelup}XP)</span>
            `;
        }

        addEventListeners() {
            // TODO: when to remove these listeners?
            EventBus.addEventListener(EVENT.EUMLING_XP_GAIN, this.update);
            EventBus.addEventListener(EVENT.EUMLING_LEVELUP, this.update);
            EventBus.addEventListener(EVENT.ENTITY_HURT, this.update);
            EventBus.addEventListener(EVENT.ENTITY_HEALED, this.update);
        }
    }
}