/// <reference path="UILayer.ts" />

namespace Script {
    export class LoadingScreenUI extends UILayer {
        constructor() {
            super();
            this.element = document.getElementById("LoadingScreen");
        }

        startLoad(){
            
        }

        addEventListeners(): void {
            this.element.addEventListener("click", this.startLoad);
        }
        removeEventListeners(): void {
            this.element.removeEventListener("click", this.startLoad);
        }

    }
}