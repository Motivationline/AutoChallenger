namespace Script {
    export abstract class UILayer {
        protected element: HTMLElement;
        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            this.element.classList.remove("hidden");
            this.element.style.zIndex = _zindex.toString();
            this.addEventListeners();
        }
        async onShow(): Promise<void> {
            this.element.classList.remove("hidden");
        }
        async onHide(): Promise<void> {
            this.element.classList.add("hidden"); // TODO should it really get hidden? or just disabled?
        }
        async onRemove(): Promise<void> {
            this.element.classList.add("hidden");
            this.removeEventListeners();
        }
        abstract addEventListeners(): void;
        abstract removeEventListeners(): void;
    }
}