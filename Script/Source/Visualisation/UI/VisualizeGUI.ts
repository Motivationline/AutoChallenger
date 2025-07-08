/// <reference path="FightUI.ts" />

namespace Script {

    // TODO: add Provider to pass UI elements without hardcoding???
    export class VisualizeGUI {
        readonly uis: Map<string, UILayer> = new Map();
        readonly activeLayers: UILayer[] = [];

        constructor() {
            this.uis.clear();
            this.uis.set("fight", new FightUI());
            this.addFightListeners();
            for(let ui of this.uis.values()){
                ui.onRemove();
            }
        }

        private get topmostLevel() {
            if (this.activeLayers.length === 0) return undefined;
            return this.activeLayers[this.activeLayers.length - 1];
        }

        addUI(_id: string) {
            let ui = this.uis.get(_id);
            if (!ui) return;
            let prevTop = this.topmostLevel;
            if (prevTop) prevTop.onHide();
            this.activeLayers.push(ui);
            ui.onAdd(1000 + this.activeLayers.length);
        }
        replaceUI(_id: string) {
            this.removeTopmostUI();
            this.addUI(_id);
        }
        removeTopmostUI() {
            let last = this.activeLayers.pop();
            last?.onHide();
            last?.onRemove();
            let newTop = this.topmostLevel;
            if (newTop) newTop.onShow();
        }
        removeAllLayers() {
            while (this.activeLayers.length > 0) {
                this.removeTopmostUI();
            }
        }

        private updateGoldCounter(_ev: FightEvent) {
            let amount = _ev.detail.amount;
            const goldCounter: HTMLDivElement = document.querySelector(".GoldCounter");
            goldCounter.innerText = `Gold: ${amount}`;
        }

        addFightListeners() {
            EventBus.addEventListener(EVENT.GOLD_CHANGE, this.updateGoldCounter);
            EventBus.addEventListener(EVENT.FIGHT_START, this.switchUI);
        }

        switchUI = (_ev: FightEvent) => {
            switch(_ev.type) {
                case EVENT.FIGHT_START: {
                    this.addUI("fight");
                }
            }
        }
    }
}