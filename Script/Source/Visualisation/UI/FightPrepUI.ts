/// <reference path="UILayer.ts" />
/// <reference path="../../Data/DataLink.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class FightPrepUI extends UILayer {
        stoneWrapper: HTMLElement;
        infoElement: HTMLElement;
        startButton: HTMLButtonElement;
        highlightNode: ƒ.Node;
        bench: VisualizeBench;
        placedEumlings: Set<Eumling> = new Set();

        constructor() {
            super();
            this.element = document.getElementById("FightPrep");
            this.stoneWrapper = document.getElementById("FightPrepStones");
            this.infoElement = document.getElementById("FightPrepInfo");
            this.startButton = document.getElementById("FightStart") as HTMLButtonElement;

            DataLink.getCopyOf("PreviewHighlight").then(node => this.highlightNode = node);
        }

        async onAdd(_zindex: number, _ev?: FightEvent): Promise<void> {
            super.onAdd(_zindex, _ev);
            this.startButton.disabled = true;
            this.startButton.classList.add("hidden");
            this.initStones();
            this.initEumlings();
            this.placedEumlings.clear();
            await this.moveCamera(ƒ.Vector3.Z(-3), ƒ.Vector3.X(10), 1000);
            const center = viewport.pointWorldToClient(ƒ.Vector3.Z(-0.3));
            document.getElementById("FightPrepInfoWrapper").style.top = center.y + "px";
            document.getElementById("FightPrepGoldCounterWrapper").appendChild(GoldDisplayElement.element);
        }

        async onRemove(): Promise<void> {
            super.onRemove();
            this.hideEntityInfo();
            await this.moveCamera(ƒ.Vector3.Z(3), ƒ.Vector3.X(-10), 1000);
        }

        private initStones() {
            const stones: HTMLElement[] = [];
            for (let stone of Run.currentRun.stones) {
                const element = createElementAdvanced("div", {classes: ["clickable"]});
                stones.push(element);
                element.appendChild(StoneUIElement.getUIElement(stone).element);
                element.addEventListener("click", () => {
                    this.hideEntityInfo();
                    this.infoElement.innerHTML = `
                    <span class="InfoTitle">${stone.id}</span>
                    <span class="InfoSmaller">Level ${stone.level + 1}</span>
                    <span class="Info">${stone.data.abilityLevels[stone.level].info}</span>`;
                    this.infoElement.classList.remove("hidden");
                });
            }
            this.stoneWrapper.replaceChildren(...stones);
        }

        private initEumlings() {
            const bench = viewport.getBranch().getChildByName("Bench")?.getComponent(VisualizeBench);
            this.bench = bench;
            if (!bench) return;
            bench.clear();
            for (let eumling of Run.currentRun.eumlings) {
                bench.addEntity(Provider.visualizer.getEntity(eumling));
            }
        }

        private returnEumling(_eumling: Eumling) {
            // remove from field
            EventBus.dispatchEventWithoutWaiting({ type: EVENT.ENTITY_REMOVED, target: _eumling })
            // add to bench
            const vis = Provider.visualizer.getEntity(_eumling);
            this.bench?.addEntity(vis);
            this.placedEumlings.delete(_eumling);
            // can we start?
            if (this.placedEumlings.size <= 0) {
                this.startButton.disabled = true;
                this.startButton.classList.add("hidden");
            }
            // update visuals
            if (vis === this.#highlightedEntity) {
                this.showEntityInfo(vis);
            }
        }

        private moveEumlingToGrid(_eumling: Eumling, _target: ƒ.Node) {
            const posId = parseInt(_target.name);
            const vis = Provider.visualizer.getEntity(_eumling);
            this.bench?.removeEntity(vis);
            EventBus.dispatchEventWithoutWaiting({ type: EVENT.ENTITY_ADDED, target: _eumling, detail: { side: "home", pos: [posId % 3, Math.floor(posId / 3)] } });
            this.placedEumlings.add(_eumling);
            this.startButton.disabled = false;
            
            this.startButton.classList.remove("hidden");
            // update visuals
            if (vis === this.#highlightedEntity) {
                this.showEntityInfo(vis);
            }
        }

        private startFight = (_ev: MouseEvent) => {
            EventBus.dispatchEventWithoutWaiting({ type: EVENT.FIGHT_PREPARE_COMPLETED });
        }

        pointerStartPosition: ƒ.Vector2 = new ƒ.Vector2();
        readonly deadzone: number = 20;
        private pointerOnCanvas = (_ev: PointerEvent) => {
            if (_ev.type === "pointerdown") {
                this.pointerStartPosition.x = _ev.clientX;
                this.pointerStartPosition.y = _ev.clientY;
            } else if (_ev.type === "pointerup") {
                const pointerEndPosition = new ƒ.Vector2(_ev.clientX, _ev.clientY);
                const distance = pointerEndPosition.getDistance(this.pointerStartPosition);
                if (distance > this.deadzone) {
                    // drag
                    this.dragCanvas(this.pointerStartPosition, pointerEndPosition);
                } else {
                    // click
                    this.clickCanvas(pointerEndPosition);
                }
            }
        }


        private clickCanvas(_pos: ƒ.Vector2) {
            this.hideEntityInfo();
            const picks = getPickableObjectsFromClientPos(_pos);
            if (!picks || picks.length === 0) return;
            for (const pick of picks) {
                if (!(pick.node instanceof VisualizeEntity)) {
                    continue;
                }
                this.showEntityInfo(pick.node);
                break;
            }
        }

        private dragCanvas(_startPos: ƒ.Vector2, _endPos: ƒ.Vector2) {
            // find which Eumling should be moved
            const picksStart = getPickableObjectsFromClientPos(_startPos);
            if (!picksStart || picksStart.length === 0) return;
            let draggedEumling: Eumling;
            for (let pick of picksStart) {
                if (!(pick.node instanceof VisualizeEntity)) continue;
                if (!(pick.node.getEntity() instanceof Eumling)) continue;
                draggedEumling = pick.node.getEntity() as Eumling;
                break;
            }
            if (!draggedEumling) return;

            // find where to move it to
            const picksEnd = getPickableObjectsFromClientPos(_endPos);
            if (!picksEnd || picksEnd.length === 0) {
                // nowhere = back to the bench
                return this.returnEumling(draggedEumling);
            }
            for (const pick of picksEnd) {
                // one of the home fields
                const num: number = Number(pick.node.name);
                if (!isNaN(num)) {
                    return this.moveEumlingToGrid(draggedEumling, pick.node);
                }
            }
        }

        #highlightedEntity: VisualizeEntity;

        private showEntityInfo(_entity: VisualizeEntity) {
            this.hideEntityInfo();
            const entity = _entity.getEntity() as Entity;

            this.infoElement.classList.remove("hidden");
            this.infoElement.innerHTML =`
                <span class="InfoTitle">${entity.id}</span>
                <span class="InfoSmaller">${entity.currentHealth} / ${entity.health}♥️</span>
                <span class="Info">${entity.info}</span>`;

            if (this.highlightNode && !this.bench.hasEntity(_entity)) {
                _entity.addChild(this.highlightNode);
                this.highlightNode.mtxLocal.translation = ƒ.Vector3.ZERO();
            }
            this.#highlightedEntity = _entity;

            const attacks = entity.select(entity.attacks, false);

            for (let attack of attacks) {
                const allies = entity instanceof Eumling ? Fight.activeFight.arena.home : Fight.activeFight.arena.away;
                const opponents = entity instanceof Eumling ? Fight.activeFight.arena.away : Fight.activeFight.arena.home;
                const detail = getTargets(attack.target, allies, opponents, entity);
                EventBus.dispatchEventWithoutWaiting({ type: EVENT.SHOW_PREVIEW, cause: entity, target: entity, trigger: attack, detail })
            }
        }

        private hideEntityInfo() {
            this.infoElement.classList.add("hidden");
            this.highlightNode?.getParent()?.removeChild(this.highlightNode);
            EventBus.dispatchEventWithoutWaiting({ type: EVENT.HIDE_PREVIEW });
            this.#highlightedEntity = undefined;
        }


        addEventListeners(): void {
            const canvas = document.getElementById("GameCanvas");
            canvas.addEventListener("pointerdown", this.pointerOnCanvas);
            canvas.addEventListener("pointerup", this.pointerOnCanvas);

            this.startButton.addEventListener("click", this.startFight);
        }
        removeEventListeners(): void {
            const canvas = document.getElementById("GameCanvas");
            canvas.removeEventListener("pointerdown", this.pointerOnCanvas);
            canvas.removeEventListener("pointerup", this.pointerOnCanvas);
            this.startButton.removeEventListener("click", this.startFight);
        }


        private async moveCamera(_translate: ƒ.Vector3, _rotate: ƒ.Vector3, _timeMS: number): Promise<void> {
            const camera = viewport?.camera;
            if(!camera) return;
            let elapsedTime: number = 0;
            const translationStart: ƒ.Vector3 = camera.mtxPivot.translation.clone;
            const rotationStart: ƒ.Vector3 = camera.mtxPivot.rotation.clone;
            const translationGoal: ƒ.Vector3 = ƒ.Vector3.SUM(translationStart, _translate);
            const rotationGoal: ƒ.Vector3 = ƒ.Vector3.SUM(rotationStart, _rotate);

            return new Promise<void>((resolve) => {
                const mover = () => {
                    const delta = ƒ.Loop.timeFrameGame;
                    elapsedTime += delta;
                    if (elapsedTime > _timeMS) {
                        camera.mtxPivot.translation = translationGoal;
                        camera.mtxPivot.rotation = rotationGoal;
                        ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, mover);
                        resolve();
                        return;
                    }
                    camera.mtxPivot.translation = ƒ.Vector3.LERP(translationStart, translationGoal, elapsedTime / _timeMS);
                    camera.mtxPivot.rotation = ƒ.Vector3.LERP(rotationStart, rotationGoal, elapsedTime / _timeMS);

                };
                ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, mover);
            });
        }
    }
}