/// <reference path="UILayer.ts" />

namespace Script {
    export class OptionsUI extends UILayer {
        closeButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("Options");
            this.closeButton = document.getElementById("OptionsClose") as HTMLButtonElement;
        }

        close = () => {
            Provider.GUI.removeTopmostUI();
        }

        addEventListeners(): void {
            this.closeButton.addEventListener("click", this.close);
        }

        removeEventListeners(): void {
            this.closeButton.removeEventListener("click", this.close);
        }

    }
}