/// <reference path="UILayer.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class FightPrepUI extends UILayer {
        stoneWrapper: HTMLElement;
        eumlingWrapper: HTMLElement;
        selectedEumling: Eumling;
        startButton: HTMLButtonElement;
        selectedSpace: ƒ.Node;
        eumlingElements: Map<Eumling, HTMLElement> = new Map();

        constructor() {
            super();
            this.element = document.getElementById("FightPrep");
            this.stoneWrapper = document.getElementById("FightPrepStones");
            this.eumlingWrapper = document.getElementById("FightPrepEumlings");
            this.startButton = document.getElementById("FightStart") as HTMLButtonElement;
        }

        onAdd(_zindex: number, _ev?: FightEvent): void {
            super.onAdd(_zindex, _ev);
            this.startButton.disabled = true;
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
            for (let eumling of Run.currentRun.eumlings) {
                const element = createElementAdvanced("div", {
                    classes: ["EumlingSelector"],
                    innerHTML: `${eumling.type} (${eumling.xp} / ${eumling.requiredXPForLevelup}XP)`,
                });
                this.eumlingElements.set(eumling, element);
                element.addEventListener("click", () => {
                    this.eumlingElements.forEach(element => { element.classList.remove("selected") });
                    element.classList.add("selected");
                    this.selectedEumling = eumling;
                    this.selectedSpace = undefined;
                });
            }
            this.eumlingWrapper.replaceChildren(...this.eumlingElements.values());
        }

        private clickCanvas = (_ev: MouseEvent) => {
            const ray = viewport.getRayFromClient(new ƒ.Vector2(_ev.clientX, _ev.clientY));
            const picks = PickSphere.pick(ray, { sortBy: "distanceToRay" });
            if (!picks || picks.length === 0) return;
            const pick = picks[0];
            if (this.selectedEumling) {
                // place eumling in map
                const posId = parseInt(pick.node.name);

                EventBus.dispatchEvent({ type: EVENT.ENTITY_ADDED, target: this.selectedEumling, detail: { side: "home", pos: [posId % 3, Math.floor(posId / 3)] } });

                if (!this.selectedSpace) {
                    // hide from UI
                    let uiElement = this.eumlingElements.get(this.selectedEumling);
                    uiElement.classList.remove("selected");
                    uiElement.hidden = true;
                }
                this.selectedSpace = pick.node;
                this.startButton.disabled = false;
            }
        }

        private returnEumling = (_ev: MouseEvent) => {
            if ((<HTMLElement>_ev.target).classList.contains("EumlingSelector")) return;
            if (!this.selectedEumling) return;
            // remove from field
            EventBus.dispatchEvent({ type: EVENT.ENTITY_REMOVED, target: this.selectedEumling })
            // add to UI
            this.eumlingElements.get(this.selectedEumling).hidden = false;
            this.selectedEumling = undefined;
            this.selectedSpace = undefined;

            if (this.eumlingElements.values().reduce((prev, curr) => prev + (curr.hidden ? 1 : 0), 0) === 0) {
                this.startButton.disabled = true;
            }
        }

        private startFight = (_ev: MouseEvent) => {
            EventBus.dispatchEvent({ type: EVENT.FIGHT_PREPARE_COMPLETED });
        }


        addEventListeners(): void {
            document.getElementById("GameCanvas").addEventListener("click", this.clickCanvas);
            this.startButton.addEventListener("click", this.startFight);
            document.getElementById("FightPrepEumlings").addEventListener("click", this.returnEumling);
        }
        removeEventListeners(): void {
            document.getElementById("GameCanvas").removeEventListener("click", this.clickCanvas);
            this.startButton.removeEventListener("click", this.startFight);
            document.getElementById("FightPrepEumlings").removeEventListener("click", this.returnEumling);
        }

    }
}