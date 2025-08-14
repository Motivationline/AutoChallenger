/// <reference path="UILayer.ts" />

namespace Script {
    export class StartScreenUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("StartScreen");
        }

        parallax = (_ev: MouseEvent) => {
            this.element.style.setProperty("--x", (_ev.clientX / window.innerWidth).toString())
            this.element.style.setProperty("--y", (_ev.clientY / window.innerHeight).toString())
        }

        addEventListeners(): void {
            document.addEventListener("mousemove", this.parallax);
        }
        removeEventListeners(): void {
            document.removeEventListener("mousemove", this.parallax);
        }

    }
}