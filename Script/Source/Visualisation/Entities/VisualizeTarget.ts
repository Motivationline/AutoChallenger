namespace Script {
    import ƒ = FudgeCore;


    // This whole VFX effect thing is convoluted and I'm unhappy with how it turned out.
    // All those nested promises and shit... we should probably rewrite that at some point.
    // But for now it seems to be doing its job decently.


    export class VisualizeTarget {
        private nodePool: Map<string, VisualizeVFX[]> = new Map();
        private visibleNodes: VisualizeVFX[] = [];

        constructor() {
            this.addEventListeners();
        }

        private addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_ATTACK, this.showAttack);
            EventBus.addEventListener(EVENT.ENTITY_ATTACKED, this.hideTargets);
            EventBus.addEventListener(EVENT.ENTITY_SPELL_BEFORE, this.showAttack);
            EventBus.addEventListener(EVENT.ENTITY_SPELL, this.hideTargets);
        }

        private showAttack = async (_ev: FightEvent) => {
            const nodes = this.getTargets(_ev);
            const promises: Promise<any>[] = [];
            for (let node of nodes) {
                promises.push(this.addNodesTo(node, this.getAdditionalVisualizer(_ev.cause as Entity, _ev.type)));
            }
            return Promise.all(promises);
        }

        private getTargets(_ev: FightEvent): ƒ.Node[] {
            if (!_ev.detail) return [];
            const targets: ƒ.Node[] = [];
            positions: if (_ev.detail.positions) {
                if (!_ev.trigger || !("target" in _ev.trigger)) break positions;
                if (typeof _ev.trigger.target === "string") break positions;

                const vis = Provider.visualizer;
                let allySide: VisualizeGrid, opponentSide: VisualizeGrid;
                if (_ev.cause instanceof Stone) {
                    allySide = vis.activeFight.home;
                    opponentSide = vis.activeFight.away;
                } else {
                    const visGrid = vis.activeFight.whereIsEntity(vis.getEntity(_ev.cause));
                    if (visGrid.side === "home") {
                        allySide = vis.activeFight.home;
                        opponentSide = vis.activeFight.away;
                    } else {
                        allySide = vis.activeFight.away;
                        opponentSide = vis.activeFight.home;
                    }
                }
                const targetSide = _ev.trigger.target.side === TARGET_SIDE.ALLY ? allySide : opponentSide;
                (_ev.detail.positions as Grid<boolean>).forEachElement(async (_el, _pos) => {
                    const anchor = targetSide.getAnchor(_pos[0], _pos[1]);
                    targets.push(anchor);
                });
                return targets;
            }
            if (!_ev.detail.targets) return [];
            for (let target of _ev.detail.targets as IEntity[]) {
                targets.push(Provider.visualizer.getEntity(target));
            }
            return targets;
        }

        private async addNodesTo(_parent: ƒ.Node, ..._nodes: VisualizationLink[]) {
            const promises: Promise<void>[] = [];
            for (let node of _nodes) {
                if (!node) continue;
                promises.push((await this.getVFX(node)).addToAndActivate(_parent));
            }
            promises.push((await this.getVFX("TargetHighlightGeneric")).addToAndActivate(_parent));
            return Promise.all(promises);
        }


        private async getVFX(_v: VisualizationLink | string): Promise<VisualizeVFX> {
            let vfx: VisualizeVFX;
            const id: string = typeof _v === "string" ? _v : _v.id;
            const delay: number = typeof _v === "string" ? 0 : _v.delay;
            if (this.nodePool.get(id)?.length > 0) vfx = this.nodePool.get(id).pop();
            else vfx = new VisualizeVFX(await DataLink.getCopyOf(id), id, delay);
            this.visibleNodes.push(vfx);
            return vfx;
        }


        private getAdditionalVisualizer(_cause: Entity | Stone, _evtype: EVENT): VisualizationLink {
            if (_cause instanceof Stone) {
                // TODO: add something so stones can define visuals, too.
                return undefined;
            }
            const id = _cause.id;
            if (!id)
                return undefined;

            return VisualizationLink.linkedVisuals.get(id)?.get(_evtype === EVENT.ENTITY_ATTACK ? ANIMATION.ATTACK : ANIMATION.SPELL);
        }

        private hideTargets = async (_ev: FightEvent) => {
            while (this.visibleNodes.length > 0) {
                this.returnNode(this.visibleNodes.pop());
            }
        }

        private returnNode(_node: VisualizeVFX) {
            _node.removeAndDeactivate();
            if (!this.nodePool.has(_node.id))
                this.nodePool.set(_node.id, []);
            this.nodePool.get(_node.id).push(_node);
        }
    }
}