/// <reference path="UILayer.ts" />

namespace Script {
    export class FightRewardUI extends UILayer {
        rewardsOverivew: HTMLElement;
        convertButton: HTMLButtonElement;
        continueButton: HTMLButtonElement;
        constructor() {
            super();
            this.element = document.getElementById("FightReward");
            this.rewardsOverivew = document.getElementById("FightRewardRewards") as HTMLElement;
            this.continueButton = document.getElementById("FightRewardContinue") as HTMLButtonElement;
            this.convertButton = document.getElementById("FightRewardConvert") as HTMLButtonElement;
        }

        eumlings: Map<HTMLElement, Eumling> = new Map();
        xp: number;
        gold: number;
        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);
            let { gold, xp, stones }: { gold: number, xp: number, stones: Stone[] } = _ev.detail;
            const rewardIcons: HTMLElement[] = [];
            if (gold) {
                rewardIcons.push(createElementAdvanced("div", {
                    innerHTML: `+${gold} Gold`,
                    classes: ["FightRewardIcon", "Gold"]
                }));
                this.gold = gold;
            }
            if (xp) {
                rewardIcons.push(createElementAdvanced("div", {
                    innerHTML: `+${xp} XP`,
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

            for (let eumling of Run.currentRun.eumlings) {
                let uiElement = EumlingUIElement.getUIElement(eumling);
                this.eumlings.set(uiElement.element, uiElement.eumling);
                uiElement.element.classList.remove("hidden");
                uiElement.element.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
            this.updateXPText();
            this.continueButton.disabled = true;
            this.convertButton.disabled = false;
        }
        onShow(): void {
            super.onShow();
            this.addEventListeners();
            for(let element of this.eumlings.keys()) {
                element.addEventListener("click", this.clickOnEumling);
            }
            document.getElementById("FightRewardXPEumlings").replaceChildren(...this.eumlings.keys());
        }
        onHide(): void {
            super.onHide();
            this.removeEventListeners();
        }

        clickOnEumling = (_ev: MouseEvent) => {
            if (this.xp <= 0) return;
            let target = _ev.target as HTMLElement;
            let eumling = this.eumlings.get(target);
            eumling.addXP(1);
            this.xp--;
            this.updateXPText();
            if (this.xp <= 0) {
                this.continueButton.disabled = false;
            }
        }

        private updateXPText() {
            document.getElementById("FightRewardXPAmount").innerText = this.xp === 0 ?
                `No more XP to distribute` :
                `Distribute ${this.xp}XP`
                ;
            this.convertButton.disabled = this.xp === 0;
        }

        convert = () => {
            Run.currentRun.changeGold(this.xp);
            this.gold += this.xp;
            document.getElementById("FightRewardRewards").querySelector(".Gold").innerHTML = `+${this.gold} Gold`;
            this.xp = 0;
            this.continueButton.disabled = false;
            this.updateXPText();
        }

        private finishRewards = () => {
            EventBus.dispatchEvent({ type: EVENT.REWARDS_CLOSE });
        }


        addEventListeners(): void {
            this.continueButton.addEventListener("click", this.finishRewards);
            this.convertButton.addEventListener("click", this.convert);
        }
        removeEventListeners(): void {
            for (let element of this.eumlings.keys()) {
                element.removeEventListener("click", this.clickOnEumling);
            }
            this.continueButton.removeEventListener("click", this.finishRewards);
            this.convertButton.removeEventListener("click", this.convert);
        }

    }
}