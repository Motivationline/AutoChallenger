namespace Script {
    export abstract class UILayer {
        protected element: HTMLElement;
        onAdd(_zindex: number, _ev?: FightEvent): void {
            this.element.classList.remove("hidden");
            this.element.style.zIndex = _zindex.toString();
            this.addEventListeners();
        }
        onShow(): void {
            this.element.classList.remove("hidden");
        }
        onHide(): void {
            this.element.classList.add("hidden"); // TODO should it really get hidden? or just disabled?
        }
        onRemove(): void {
            this.element.classList.add("hidden");
            this.removeEventListeners();
        }
        abstract addEventListeners(): void;
        abstract removeEventListeners(): void;
    }
}