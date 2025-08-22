/// <reference path="UILayer.ts" />

namespace Script {
    export class IntroUI extends UILayer {

        continueButton: HTMLElement;
        elements: HTMLElement[];
        constructor() {
            super();
            this.element = document.getElementById("Introduction");
            this.continueButton = document.getElementById("IntroContinue");
            this.elements = Array.from(document.querySelectorAll(".IntroInner"));
        }

        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);
            this.elements.forEach(el => el.classList.remove("visible"));
            this.progress = 0;
            this.next();
        }

        start = () => {
            run();
            Provider.GUI.removeTopmostUI();
        }

        timeout: number;
        progress: number = 0;
        next = () => {
            clearTimeout(this.timeout);
            let element = this.elements[this.progress++];
            if (!element) return;

            element.classList.add("visible");
            this.timeout = setTimeout(this.next, 1000);
        }

        addEventListeners(): void {
            this.element.addEventListener("click", this.next);
            this.continueButton.addEventListener("click", this.start);
        }

        removeEventListeners(): void {
            this.element.removeEventListener("click", this.next);
            this.continueButton.removeEventListener("click", this.start);
        }
    }
}