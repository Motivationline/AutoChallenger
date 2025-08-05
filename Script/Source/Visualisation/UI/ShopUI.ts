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
        stonesInfo: HTMLElement;
        stoneUpgradeInfo: HTMLElement;
        stoneBuyButton: HTMLButtonElement;
        stoneUpgradeButton: HTMLButtonElement;
        stonesRefreshButton: HTMLButtonElement;
        stoneUpgradeWrapper: HTMLElement;
        eumlingHealWrapper: HTMLElement;
        stoneToHtmlElement: Map<Stone, HTMLElement> = new Map();
        constructor() {
            super();
            this.element = document.getElementById("Shop");
            this.closeButton = document.getElementById("ShopClose") as HTMLButtonElement;
            this.stonesWrapper = document.getElementById("ShopStones");
            this.stonesInfo = document.getElementById("ShopStonesInfo");
            this.stonesRefreshButton = document.getElementById("ShopStonesRefresh") as HTMLButtonElement;
            this.stoneBuyButton = document.getElementById("ShopStonesBuy") as HTMLButtonElement;
            this.stoneUpgradeButton = document.getElementById("ShopStonesUpgrade") as HTMLButtonElement;
            this.stoneUpgradeInfo = document.getElementById("ShopStonesUpgradeInfo");
            this.stoneUpgradeWrapper = document.getElementById("ShopStoneUpgrades");
            this.eumlingHealWrapper = document.getElementById("ShopEumlingHeal");
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);

            this.setupStonesToBuy();
            this.setupStonesToUpgrade();
            this.initEumlingHealing();
        }

        selectedStone: Stone;
        private setupStonesToBuy() {
            this.stoneBuyButton.disabled = true;
            this.stonesInfo.innerText = "";
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
                });
                wrapper.prepend(uiStoneElement.element);
                newStoneElements.push(wrapper);
                this.stoneToHtmlElement.set(stone, wrapper);
                wrapper.addEventListener("click", () => {
                    this.selectedStone = stone;
                    this.stonesInfo.innerText = stone.data.abilityLevels[stone.level].info;
                    this.stoneBuyButton.innerText = `${cost} Gold`;
                    this.stoneBuyButton.disabled = Run.currentRun.gold < cost;
                    newStoneElements.forEach(el => el.classList.remove("selected"));
                    wrapper.classList.add("selected");
                });
            }
            this.stonesWrapper.replaceChildren(...newStoneElements);
        }
        
        private buyStone = (_ev: MouseEvent) => {
            const stone = this.selectedStone;
            if (!stone) return;
            const cost = stone.level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
            if (Run.currentRun.gold < cost) return;
            Run.currentRun.changeGold(-cost);
            EventBus.dispatchEvent({ type: EVENT.CHOSEN_STONE, detail: { stone } });
            this.selectedStone = undefined;
            this.stoneBuyButton.disabled = true;
            this.stonesInfo.innerText = "";
            this.stoneToHtmlElement.get(stone)?.remove();
        }
        
        selectedStoneToUpgrade: Stone;
        private setupStonesToUpgrade() {
            this.stoneUpgradeButton.disabled = true;
            const upgradeableStones = chooseRandomElementsFromArray(Run.currentRun.stones, Infinity, Run.currentRun.stones.filter(stone => stone.level === 1));
            if (upgradeableStones.length === 0) {
                this.stoneUpgradeWrapper.replaceChildren(createElementAdvanced("p", { innerHTML: "No more stones upgradeable." }))
                return;
            }

            const upgradeStoneElements: HTMLElement[] = [];
            for (let stone of upgradeableStones) {
                const element = createElementAdvanced("div", {
                    classes: ["ShopOption"],
                });
                element.prepend(StoneUIElement.getUIElement(stone).element);
                upgradeStoneElements.push(element);
                element.addEventListener("click", () => {
                    this.selectedStoneToUpgrade = stone;
                    this.stoneUpgradeButton.disabled = Run.currentRun.gold < COST.UPGRADE_STONE;
                    this.stoneUpgradeInfo.innerText = stone.data.abilityLevels[stone.level + 1].info;
                    
                    upgradeStoneElements.forEach(el => el.classList.remove("selected"));
                    element.classList.add("selected");
                });
                this.stoneToHtmlElement.set(stone, element);
            }
            this.stoneUpgradeWrapper.replaceChildren(...upgradeStoneElements);

        }
        private upgradeStone = (_ev: MouseEvent) => {
            const stone = this.selectedStoneToUpgrade;
            if (!stone) return;
            const cost = COST.UPGRADE_STONE;
            if (Run.currentRun.gold < cost) return;
            Run.currentRun.changeGold(-cost);
            stone.level++;
            this.stoneUpgradeButton.disabled = true;
            this.selectedStoneToUpgrade = undefined;
            this.stoneUpgradeInfo.innerText = "";
            this.stoneToHtmlElement.get(stone)?.remove();
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
            this.stoneBuyButton.addEventListener("click", this.buyStone);
            this.stoneUpgradeButton.addEventListener("click", this.upgradeStone);
        }
        removeEventListeners(): void {
            this.closeButton.removeEventListener("click", this.close);
            this.stonesRefreshButton.removeEventListener("click", this.refresh);
            this.stoneBuyButton.removeEventListener("click", this.buyStone);
            this.stoneUpgradeButton.removeEventListener("click", this.upgradeStone);
        }

    }
}