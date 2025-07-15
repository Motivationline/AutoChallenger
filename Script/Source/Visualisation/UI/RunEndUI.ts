/// <reference path="UILayer.ts" />

namespace Script {
    export class RunEndUI extends UILayer {
        continueButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("RunEnd");
            this.continueButton = document.getElementById("Restart") as HTMLButtonElement;
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);
            document.getElementById("RunEndInner").innerHTML = 
            _ev.detail.success ?
            `<h2>Success!</h2>
            <p>You won! :&gt;</p>
            <p>Try again?</p>`:
            `<h2>Defeat!</h2>
            <p>You lost. :(;</p>
            <p>Try again?</p>`;
        }

        close = () => {
            location.reload();
        }

        addEventListeners(): void {
            this.continueButton.addEventListener("click", this.close);
        }
        removeEventListeners(): void {
            this.continueButton.removeEventListener("click", this.close);
        }

    }
}