/// <reference path="UILayer.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class FightPrepUI extends UILayer {
        stoneWrapper: HTMLElement;
        eumlingWrapper: HTMLElement;
        selectedEumling: Eumling;

        constructor() {
            super();
            this.element = document.getElementById("FightPrep");
            this.stoneWrapper = document.getElementById("FightPrepStones");
            this.eumlingWrapper = document.getElementById("FightPrepEumlings");
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);
            this.initStones();
            this.initEumlings();
        }

        private initStones() {
            const stones: HTMLElement[] = [];
            for (let stone of Run.currentRun.stones) {
                stones.push(createElementAdvanced("div", {
                    classes: ["Stone"],
                    innerHTML: `${stone.id}\nLvl ${stone.level + 1}`,
                }));
            }
            this.stoneWrapper.replaceChildren(...stones);
        }

        private initEumlings() {
            const eumlingElements: HTMLElement[] = [];
            for (let eumling of Run.currentRun.eumlings) {
                const element = createElementAdvanced("div", {
                    classes: ["EumlingSelector"],
                    innerHTML: `${eumling.type} (${eumling.xp} / ${eumling.requiredXPForLevelup}XP)`,
                });
                eumlingElements.push(element);
                element.addEventListener("click", () => {
                    eumlingElements.forEach(element => { element.classList.remove("selected") });
                    element.classList.add("selected");
                    this.selectedEumling = eumling;
                });
            }
            this.eumlingWrapper.replaceChildren(...eumlingElements);
        }

        private clickCanvas(_ev: MouseEvent) {
            const ray = viewport.getRayFromClient(new ƒ.Vector2(_ev.clientX, _ev.clientY));
            const picks = PickSphere.pick(ray, { sortBy: "distanceToRay" });
            if (!picks || picks.length === 0) return;
            const pick = picks[0];
            console.log("clicked on", pick.node.name);
        }


        addEventListeners(): void {
            document.getElementById("GameCanvas").addEventListener("click", this.clickCanvas);
        }
        removeEventListeners(): void {
        }

    }
}