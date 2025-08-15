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
        info: HTMLElement;
        infoOverlay: HTMLElement;
        stoneUpgradeInfo: HTMLElement;
        stoneRefreshButton: HTMLButtonElement;
        confirmButton: HTMLButtonElement;
        stoneUpgradeWrapper: HTMLElement;
        eumlingHealWrapper: HTMLElement;
        stoneToHtmlElement: Map<Stone, HTMLElement> = new Map();
        constructor() {
            super();
            this.element = document.getElementById("Shop");
            this.closeButton = document.getElementById("ShopClose") as HTMLButtonElement;
            this.stonesWrapper = document.getElementById("ShopStones");
            this.info = document.getElementById("ShopInfo");
            this.infoOverlay = document.getElementById("ShopInfoOverlayWrapper");
            this.stoneRefreshButton = document.getElementById("ShopStonesRefresh") as HTMLButtonElement;
            this.confirmButton = document.getElementById("ShopStonesBuy") as HTMLButtonElement;
            this.stoneUpgradeInfo = document.getElementById("ShopStonesUpgradeInfo");
            this.stoneUpgradeWrapper = document.getElementById("ShopStoneUpgrades");
            this.eumlingHealWrapper = document.getElementById("ShopEumlingHeal");
        }

        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);

            this.setupStonesToBuy();
            this.setupStonesToUpgrade();
            this.initEumlingHealing();
            this.hideOverlay();
            document.getElementById("ShopGoldWrapper").appendChild(GoldDisplayElement.element);
        }

        selectedStone: Stone;
        private setupStonesToBuy() {
            this.stoneRefreshButton.disabled = Run.currentRun.gold < COST.REFRESH;
            const existingStones = Run.currentRun.stones.map((stone) => stone.data);
            const newStones = chooseRandomElementsFromArray(Provider.data.stones, 2, existingStones);

            if (newStones.length === 0) {
                this.stonesWrapper.replaceChildren(createElementAdvanced("p", { innerHTML: "No more stones available." }));
                this.stoneRefreshButton.disabled = true;
                return;
            }
            const newStoneElements: HTMLElement[] = [];
            for (let stoneData of newStones) {
                let level = (Math.random() < 0.2) ? 1 : 0;
                let cost = level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
                let stone = new Stone(stoneData, level);
                let uiStoneElement = StoneUIElement.getUIElement(stone);

                let wrapper = createElementAdvanced("div", {
                    classes: ["BuyStone", "ShopOption", "clickable", "selectable"],
                    attributes: [["data-level", level.toString()], ["data-cost", cost.toString()]],
                    innerHTML: `<span class="GoldDisplay">${cost}</span>`
                });
                wrapper.prepend(uiStoneElement.element);
                newStoneElements.push(wrapper);
                this.stoneToHtmlElement.set(stone, wrapper);
                wrapper.addEventListener("click", () => {
                    this.showOverlay(stone, cost, false);
                });
            }
            this.stonesWrapper.replaceChildren(...newStoneElements);
            this.updateCostDisplays();
        }

        private buyStone() {
            const stone = this.selectedStone;
            if (!stone) return;
            const cost = stone.level == 0 ? COST.BUY_LVL1 : COST.BUY_LVL2;
            if (Run.currentRun.gold < cost) return;
            Run.currentRun.changeGold(-cost);
            EventBus.dispatchEvent({ type: EVENT.CHOSEN_STONE, detail: { stone } });
            this.stoneToHtmlElement.get(stone)?.remove();
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
                    classes: ["ShopOption", "clickable", "selectable"],
                    innerHTML: `<span class="GoldDisplay">${COST.UPGRADE_STONE}</span>`,
                    attributes: [["data-cost", COST.UPGRADE_STONE.toString()]],
                });
                element.prepend(StoneUIElement.getUIElement(stone).element);
                upgradeStoneElements.push(element);
                element.addEventListener("click", () => {
                    this.showOverlay(stone, COST.UPGRADE_STONE, true);
                });
                this.stoneToHtmlElement.set(stone, element);
            }
            this.stoneUpgradeWrapper.replaceChildren(...upgradeStoneElements);

        }
        private upgradeStone() {
            const stone = this.selectedStone;
            if (!stone) return;
            const cost = COST.UPGRADE_STONE;
            if (Run.currentRun.gold < cost) return;
            Run.currentRun.changeGold(-cost);
            stone.level++;
            this.stoneToHtmlElement.get(stone)?.remove();
            this.setupStonesToUpgrade();
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
                    classes: ["ShopOption", "clickable", "selectable"],
                    innerHTML: `<span class="GoldDisplay">${COST.HEAL_EUMLING}</span>`,
                    attributes: [["data-cost", COST.HEAL_EUMLING.toString()]]
                });

                wrapper.prepend(EumlingUIElement.getUIElement(eumling).element);
                wrapper.addEventListener("click", () => {
                    if (Run.currentRun.gold < COST.HEAL_EUMLING) return;
                    Run.currentRun.changeGold(-COST.HEAL_EUMLING);
                    eumling.affect({ type: SPELL_TYPE.HEAL, level: 1, target: undefined });
                    if (eumling.currentHealth >= eumling.health) wrapper.remove();
                    this.updateCostDisplays();
                });
            }
            this.eumlingHealWrapper.replaceChildren(...elements);
        }

        private hideOverlay = () => {
            this.infoOverlay.classList.add("hidden");
            this.selectedStone = undefined;
            this.updateCostDisplays();
        }

        currentSelectedStoneIsAnUpgrade: boolean = false;
        private showOverlay(_stone: Stone, _cost: number, _upgrade: boolean) {
            if (_cost > Run.currentRun.gold) return;
            this.infoOverlay.classList.remove("hidden");
            this.selectedStone = _stone;
            this.currentSelectedStoneIsAnUpgrade = _upgrade;
            const level = _stone.level + Number(_upgrade);
            this.info.innerHTML = `
                <span class="InfoTitle">${_stone.id}</span>
                <span class="InfoSmaller">Level ${level + 1}</span>
                <span class="Info">${_stone.data.abilityLevels[level].info}</span>
                <span class="GoldDisplay">${_cost}</span>`;
            this.infoOverlay.style.setProperty("--stone-url", `url("./Assets/UIElemente/Stones/${_stone.id}.png")`);
            this.infoOverlay.dataset.level = level.toString();
            this.confirmButton.innerText = _upgrade ? "Upgrade" : "Buy";
        }

        private updateCostDisplays() {
            const elements = this.element.querySelectorAll("[data-cost]") as NodeListOf<HTMLElement>;
            for (let element of elements) {
                const cost = Number(element.dataset.cost);
                if (cost > Run.currentRun.gold) {
                    element.classList.add("too-expensive");
                } else {
                    element.classList.remove("too-expensive");
                }
            }
        }

        private confirm = () => {
            if (!this.selectedStone) return this.hideOverlay();
            if (this.currentSelectedStoneIsAnUpgrade) {
                this.upgradeStone();
            } else {
                this.buyStone();
            }
            this.hideOverlay();
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
            this.stoneRefreshButton.addEventListener("click", this.refresh);
            document.getElementById("ShopStonesCancel").addEventListener("click", this.hideOverlay);
            this.confirmButton.addEventListener("click", this.confirm);
        }
        removeEventListeners(): void {
            this.closeButton.removeEventListener("click", this.close);
            this.stoneRefreshButton.removeEventListener("click", this.refresh);
            document.getElementById("ShopStonesCancel").removeEventListener("click", this.hideOverlay);
            this.confirmButton.removeEventListener("click", this.confirm);
        }

    }
}