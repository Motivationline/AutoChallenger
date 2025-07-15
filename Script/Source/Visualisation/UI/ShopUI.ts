/// <reference path="UILayer.ts" />

namespace Script {
    export class ShopUI extends UILayer {
        closeButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("Shop");
            this.closeButton = document.getElementById("ShopClose") as HTMLButtonElement;
        }

        close = () => {
            EventBus.dispatchEvent({type: EVENT.SHOP_CLOSE});
        }

        addEventListeners(): void {
            this.closeButton.addEventListener("click", this.close);
        }
        removeEventListeners(): void {
            this.closeButton.removeEventListener("click", this.close);
        }

    }
}