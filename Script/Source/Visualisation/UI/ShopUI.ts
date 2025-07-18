/// <reference path="UILayer.ts" />

namespace Script {
    const COST = {
        HEAL_EUMLING: 1,
        BUY_LVL1: 2,
        BUY_LVL2: 3,
        UPGRADE_STONE: 2,
        REFRESH: 1,
    }
    export class ShopUI extends UILayer {
        closeButton: HTMLButtonElement;
        stonesWrapper: HTMLElement;
        stonesRefreshButton: HTMLButtonElement;
        stoneUpgradeWrapper: HTMLElement;
        eumlingHealWrapper: HTMLElement;
        constructor() {
            super();
            this.element = document.getElementById("Shop");
            this.closeButton = document.getElementById("ShopClose") as HTMLButtonElement;
            this.stonesWrapper = document.getElementById("ShopStones");
            this.stonesRefreshButton = document.getElementById("ShopStonesRefresh") as HTMLButtonElement;
            this.stoneUpgradeWrapper = document.getElementById("ShopStoneUpgrades");
            this.eumlingHealWrapper = document.getElementById("ShopEumlingHeal");
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);

            this.setupStonesToBuy();
            this.setupStonesToUpgrade();
            this.initEumlingHealing();
        }

        private setupStonesToBuy() {
            const existingStones = Run.currentRun.stones.map((stone) => stone.data);
            const newStones = chooseRandomElementsFromArray(Provider.data.stones, 2, existingStones);
            if (newStones.length === 0) {
                this.stonesWrapper.replaceChildren(createElementAdvanced("p", { innerHTML: "No more stones available." }))
                return;
            }
            const newStoneElements: HTMLElement[] = [];
            for (let stoneData of newStones) {
                let level = (Math.random() < 0.2) ? 1 : 0;
                let cost = level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
                let stone = new Stone(stoneData, level);
                let uiStoneElement = StoneUIElement.getUIElement(stone);

                let wrapper = createElementAdvanced("div", {
                    classes: ["BuyStone", "ShopOption"],
                    attributes: [["data-level", level.toString()]],
                    innerHTML: `<span>${cost} Gold</span>`,
                });
                wrapper.prepend(uiStoneElement.element);
                newStoneElements.push(wrapper);
                wrapper.addEventListener("click", () => {
                    if (Run.currentRun.gold < cost) return;
                    Run.currentRun.changeGold(-cost);
                    EventBus.dispatchEvent({ type: EVENT.CHOSEN_STONE, detail: { stone } });
                    wrapper.remove();
                });
            }
            this.stonesWrapper.replaceChildren(...newStoneElements);
        }
        private setupStonesToUpgrade() {
            const upgradeableStones = chooseRandomElementsFromArray(Run.currentRun.stones, Infinity, Run.currentRun.stones.filter(stone => stone.level === 1));
            if (upgradeableStones.length === 0) {
                this.stoneUpgradeWrapper.replaceChildren(createElementAdvanced("p", { innerHTML: "No more stones upgradeable." }))
                return;
            }

            const upgradeStoneElements: HTMLElement[] = [];
            for (let stone of upgradeableStones) {
                const element = createElementAdvanced("div", {
                    innerHTML: `<span>Levelup: ${COST.UPGRADE_STONE} Gold</span>`,
                    classes: ["ShopOption"],
                });
                element.prepend(StoneUIElement.getUIElement(stone).element);
                upgradeStoneElements.push(element);
                element.addEventListener("click", () => {
                    if (Run.currentRun.gold < COST.UPGRADE_STONE) return;
                    stone.level++;
                    Run.currentRun.changeGold(-COST.UPGRADE_STONE);
                    element.remove();
                });
            }
            this.stoneUpgradeWrapper.replaceChildren(...upgradeStoneElements);

        }
        private initEumlingHealing() {
            const healableEumlings = Run.currentRun.eumlings.filter(eumling => eumling.currentHealth < eumling.health);
            if (healableEumlings.length === 0) {
                this.eumlingHealWrapper.replaceChildren(createElementAdvanced("p", { innerHTML: "No Eumlings need healing." }))
                return;
            }

            const elements: HTMLElement[] = [];
            for (let eumling of healableEumlings) {
                const wrapper = createElementAdvanced("div", {
                    classes: ["ShopOption"],
                    innerHTML: `<span>+♥️: ${COST.HEAL_EUMLING} Gold</span>`,
                });

                wrapper.prepend(EumlingUIElement.getUIElement(eumling).element);
                wrapper.addEventListener("click", () => {
                    if (Run.currentRun.gold < COST.HEAL_EUMLING) return;
                    Run.currentRun.changeGold(-COST.HEAL_EUMLING);
                    eumling.affect({ type: SPELL_TYPE.HEAL, level: 1, target: undefined });
                    if (eumling.currentHealth >= eumling.health) wrapper.remove();
                });
            }
            this.eumlingHealWrapper.replaceChildren(...elements);
        }

        close = () => {
            EventBus.dispatchEvent({ type: EVENT.SHOP_CLOSE });
        }

        refresh = () => {
            if (Run.currentRun.gold < COST.REFRESH) return;
            Run.currentRun.changeGold(-COST.REFRESH);
            this.setupStonesToBuy();
        }

        addEventListeners(): void {
            this.closeButton.addEventListener("click", this.close);
            this.stonesRefreshButton.addEventListener("click", this.refresh);
        }
        removeEventListeners(): void {
            this.closeButton.removeEventListener("click", this.close);
            this.stonesRefreshButton.removeEventListener("click", this.refresh);
        }

    }
}