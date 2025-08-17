/// <reference path="UILayer.ts" />

namespace Script {
    export class FightRewardUI extends UILayer {
        rewardsOverivew: HTMLElement;
        infoElement: HTMLElement;
        convertButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;
        confirmButton: HTMLButtonElement;
        continueButtonWrapper: HTMLElement;
        constructor() {
            super();
            this.element = document.getElementById("FightReward");
            this.infoElement = document.getElementById("FightRewardInfo");
            this.rewardsOverivew = document.getElementById("FightRewardRewards") as HTMLElement;
            this.continueButtonWrapper = document.getElementById("FightRewardContinueWrapper") as HTMLButtonElement;
            this.convertButton = document.getElementById("FightRewardConvert") as HTMLButtonElement;
            this.confirmButton = document.getElementById("FightRewardConfirm") as HTMLButtonElement;
            this.cancelButton = document.getElementById("FightRewardCancel") as HTMLButtonElement;
        }

        eumlings: Map<HTMLElement, Eumling> = new Map();
        xp: number;
        gold: number;
        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);
            let { gold, xp, stones }: { gold: number, xp: number, stones: Stone[] } = _ev.detail;
            const rewardIcons: HTMLElement[] = [];
            if (gold) {
                rewardIcons.push(createElementAdvanced("div", {
                    innerHTML: `<span>${gold}</span>`,
                    classes: ["FightRewardIcon", "Gold"]
                }));
                this.gold = gold;
            }
            if (xp) {
                rewardIcons.push(createElementAdvanced("div", {
                    innerHTML: `<span>${xp}</span>`,
                    classes: ["FightRewardIcon", "XP"]
                }));
                this.xp = xp;
            }
            if (stones) {
                for (let stone of stones) {
                    rewardIcons.push(createElementAdvanced("div", {
                        innerHTML: `${stone.id}`,
                        classes: ["FightRewardIcon", "Stone"]
                    }));
                }
            }
            this.rewardsOverivew.replaceChildren(...rewardIcons);

            this.eumlings.clear();
            for (let eumling of Run.currentRun.eumlings) {
                let uiElement = createElementAdvanced("div", { classes: ["selectable", "clickable"] });
                uiElement.appendChild(EumlingUIElement.getUIElement(eumling).element);
                this.eumlings.set(uiElement, eumling);
                uiElement.classList.remove("hidden");
                uiElement.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
            this.updateXPText();
            this.continueButtonWrapper.classList.add("hidden");
            this.convertButton.disabled = false;
            this.convertButton.classList.remove("hidden");
            this.hideInfo();

            document.getElementById("FightRewardGoldWrapper").appendChild(GoldDisplayElement.element);
        }
        async onShow(): Promise<void> {
            super.onShow();
            this.addEventListeners();
            this.eumlings.forEach((eum, el) => {
                el.appendChild(EumlingUIElement.getUIElement(eum).element);
            })
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
        }
        async onHide(): Promise<void> {
            super.onHide();
            this.removeEventListeners();
        }

        selectedEumling: Eumling;
        clickOnEumling = (_ev: MouseEvent) => {
            if (this.xp <= 0) return;
            let target = _ev.currentTarget as HTMLElement;
            let eumling = this.eumlings.get(target);
            if (!eumling) return;
            this.eumlings.keys().forEach(el => el.classList.remove("selected"));
            target.classList.add("selected");
            this.showAndUpdateInfo(eumling);
        }

        clickOnConfirm = () => {
            if (!this.selectedEumling) return;
            this.selectedEumling.addXP(1);
            this.xp--;
            this.updateXPText();
            this.showAndUpdateInfo(this.selectedEumling);
            if (this.xp <= 0) {
                this.continueButtonWrapper.classList.remove("hidden");
                this.hideInfo();
            }
        }

        eumlingLevelup = () => {
            this.eumlings.forEach((eum, el) => {
                el.appendChild(EumlingUIElement.getUIElement(eum).element);
            })
        }

        private showAndUpdateInfo(eumling: Eumling) {
            this.selectedEumling = eumling;
            this.infoElement.parentElement.classList.remove("hidden");
            this.infoElement.innerHTML = `
            <span class="InfoTitle">${eumling.type}</span>
            <span class="Info">${eumling.currentHealth} / ${eumling.health}♥️</span>
            <span class="Info">${eumling.xp} / ${eumling.requiredXPForLevelup}XP</span>
            <span class="Info">${eumling.info}</span>`;
        }

        private hideInfo() {
            this.infoElement.parentElement.classList.add("hidden");
        }

        private updateXPText() {
            document.getElementById("FightRewardXPAmount").innerText = this.xp.toString();
            this.convertButton.disabled = this.xp === 0;
            this.convertButton.disabled ? this.convertButton.classList.add("hidden") : this.convertButton.classList.remove("hidden");
        }

        convert = () => {
            Run.currentRun.changeGold(this.xp);
            this.gold += this.xp;
            document.getElementById("FightRewardRewards").querySelector(".Gold span").innerHTML = `${this.gold}`;
            this.xp = 0;
            this.continueButtonWrapper.classList.remove("hidden");
            this.convertButton.disabled = true;
            this.convertButton.classList.add("hidden");
            this.updateXPText();
            this.hideInfo();
        }

        private finishRewards = () => {
            EventBus.dispatchEvent({ type: EVENT.REWARDS_CLOSE });
        }

        private removeOverlay = (_ev: MouseEvent) => {
            const target = _ev.target as HTMLElement;
            if (target.classList.contains("clickable")) return;
            if (target.classList.contains("selectable")) return;
            if (target.tagName === "button") return;
            this.hideInfo();
            this.selectedEumling = undefined;
            this.eumlings.keys().forEach(el => el.classList.remove("selected"));
        }


        addEventListeners(): void {
            this.cancelButton.addEventListener("click", this.removeOverlay);
            this.continueButtonWrapper.addEventListener("click", this.finishRewards);
            this.convertButton.addEventListener("click", this.convert);
            this.confirmButton.addEventListener("click", this.clickOnConfirm);
            EventBus.addEventListener(EVENT.EUMLING_LEVELUP_CHOSEN, this.eumlingLevelup);
        }
        removeEventListeners(): void {
            for (let element of this.eumlings.keys()) {
                element.removeEventListener("click", this.clickOnEumling);
            }
            this.cancelButton.removeEventListener("click", this.removeOverlay);
            this.continueButtonWrapper.removeEventListener("click", this.finishRewards);
            this.convertButton.removeEventListener("click", this.convert);
            this.confirmButton.removeEventListener("click", this.clickOnConfirm);
            EventBus.removeEventListener(EVENT.EUMLING_LEVELUP_CHOSEN, this.eumlingLevelup);
        }

    }
}