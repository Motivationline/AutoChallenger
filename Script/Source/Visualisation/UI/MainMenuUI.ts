/// <reference path="UILayer.ts" />

namespace Script {
    export class MainMenuUI extends UILayer {
        startButton: HTMLButtonElement;
        optionsButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("MainMenu");
            this.startButton = document.getElementById("MainStart") as HTMLButtonElement;
            this.optionsButton = document.getElementById("MainOptions") as HTMLButtonElement;
        }

        start = () => {
            Provider.GUI.replaceUI("intro")
        }
        openOptions = () => {
            Provider.GUI.addUI("options");
        }

        addEventListeners(): void {
            this.startButton.addEventListener("click", this.start);
            this.optionsButton.addEventListener("click", this.openOptions);
        }
        removeEventListeners(): void {
            this.startButton.removeEventListener("click", this.start);
            this.optionsButton.removeEventListener("click", this.openOptions);
        }

    }
}