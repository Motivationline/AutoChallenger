/// <reference path="UILayer.ts" />

namespace Script {
    export class RunEndUI extends UILayer {
        continueButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("RunEnd");
            this.continueButton = document.getElementById("RunEndMainMenu") as HTMLButtonElement;
        }

        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);
            document.getElementById("RunEndInner").innerHTML = 
            _ev.detail.success ?
            `<h2>Success!</h2>
            <p>You won! :)</p>`:
            `<h2>Defeat!</h2>
            <p>You lost. :(</p>`;
        }

        close = () => {
            Provider.GUI.removeAllLayers();
            Provider.GUI.addUI("start");
            Provider.GUI.addUI("mainMenu");
        }

        addEventListeners(): void {
            this.continueButton.addEventListener("click", this.close);
        }
        removeEventListeners(): void {
            this.continueButton.removeEventListener("click", this.close);
        }

    }
}