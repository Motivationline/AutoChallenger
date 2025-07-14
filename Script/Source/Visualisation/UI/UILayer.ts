namespace Script {
    export abstract class UILayer {
        protected element: HTMLElement;
        onAdd(_zindex: number, _ev?: FightEvent): void {
            this.element.hidden = false;
            this.element.style.zIndex = _zindex.toString();
            this.addEventListeners();
        }
        onShow(): void {
            this.element.hidden = false;
        }
        onHide(): void {
            this.element.hidden = true; // TODO should it really get hidden? or just disabled?
        }
        onRemove(): void {
            this.element.hidden = true;
            this.removeEventListeners();
        }
        abstract addEventListeners(): void;
        abstract removeEventListeners(): void;
    }
}