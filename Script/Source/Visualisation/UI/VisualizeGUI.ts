/// <reference path="FightUI.ts" />
/// <reference path="ChooseEumlingUI.ts" />
/// <reference path="ChooseStoneUI.ts" />

namespace Script {

    // TODO: add Provider to pass UI elements without hardcoding???
    export class VisualizeGUI {
        readonly uis: Map<string, UILayer> = new Map();
        readonly activeLayers: UILayer[] = [];

        constructor() {
            this.uis.clear();
            this.uis.set("chooseEumling", new ChooseEumlingUI());
            this.uis.set("chooseStone", new ChooseStoneUI());
            this.uis.set("chooseEncounter", new MapUI());
            this.uis.set("map", new MapUI());
            this.uis.set("fightPrepare", new FightPrepUI());
            this.uis.set("fight", new FightUI());
            this.uis.set("fightReward", new FightRewardUI());
            this.uis.set("shop", new ShopUI());
            this.addFightListeners();
            for(let ui of this.uis.values()){
                ui.onRemove();
            }
        }

        private get topmostLevel() {
            if (this.activeLayers.length === 0) return undefined;
            return this.activeLayers[this.activeLayers.length - 1];
        }

        addUI(_id: string, _ev?: FightEvent) {
            let ui = this.uis.get(_id);
            if (!ui) return;
            let prevTop = this.topmostLevel;
            if (prevTop) prevTop.onHide();
            this.activeLayers.push(ui);
            ui.onAdd(1000 + this.activeLayers.length, _ev);
        }
        replaceUI(_id: string, _ev?: FightEvent) {
            this.removeTopmostUI();
            this.addUI(_id, _ev);
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
            EventBus.addEventListener(EVENT.CHOOSE_STONE, this.switchUI);
            EventBus.addEventListener(EVENT.CHOOSE_EUMLING, this.switchUI);
            EventBus.addEventListener(EVENT.CHOOSE_ENCOUNTER, this.switchUI);
            EventBus.addEventListener(EVENT.FIGHT_PREPARE, this.switchUI);
            EventBus.addEventListener(EVENT.REWARDS_OPEN, this.switchUI);
        }

        switchUI = (_ev: FightEvent) => {
            switch(_ev.type) {
                case EVENT.FIGHT_START: {
                    this.replaceUI("fight", _ev);
                    break;
                }
                case EVENT.CHOOSE_STONE: {
                    this.replaceUI("chooseStone", _ev);
                    break;
                }
                case EVENT.CHOOSE_EUMLING: {
                    this.replaceUI("chooseEumling", _ev);
                    break;
                }
                case EVENT.CHOOSE_ENCOUNTER: {
                    this.replaceUI("chooseEncounter", _ev);
                    break;
                }
                case EVENT.FIGHT_PREPARE: {
                    this.replaceUI("fightPrepare", _ev);
                    break;
                }
                case EVENT.REWARDS_OPEN: {
                    this.replaceUI("fightReward", _ev);
                    break;
                }
            }
        }
    }
}