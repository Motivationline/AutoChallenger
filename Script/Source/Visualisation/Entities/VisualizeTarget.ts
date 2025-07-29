namespace Script {
    import ƒ = FudgeCore;
    export class VisualizeTarget {
        private nodePool: ƒ.Node[] = [];
        private visibleNodes: ƒ.Node[] = [];

        constructor() {
            this.addEventListeners();
        }

        private addEventListeners() {
            EventBus.addEventListener(EVENT.ENTITY_ATTACK, this.showTargets);
            EventBus.addEventListener(EVENT.ENTITY_ATTACKED, this.hideTargets);
            EventBus.addEventListener(EVENT.ENTITY_SPELL_BEFORE, this.showTargets);
            EventBus.addEventListener(EVENT.ENTITY_SPELL, this.hideTargets);
        }

        private async getNode(): Promise<ƒ.Node> {
            let node: ƒ.Node;
            if (this.nodePool.length > 0) node = this.nodePool.pop();
            else node = await DataLink.getCopyOf("TargetHighlightGeneric");
            this.visibleNodes.push(node);
            return node;
        }

        private returnNode(_node: ƒ.Node) {
            _node.getParent()?.removeChild(_node);
            this.nodePool.push(_node);
        }

        private showTargets = async (_ev: FightEvent) => {
            if (!_ev.detail) return;
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
                    anchor.addChild(await this.getNode());
                });
                return;
            }
            if (!_ev.detail.targets) return;
            for (let target of _ev.detail.targets as IEntity[]) {
                Provider.visualizer.getEntity(target).addChild(await this.getNode());
            }
        }

        private hideTargets = async (_ev: FightEvent) => {
            while (this.visibleNodes.length > 0) {
                this.returnNode(this.visibleNodes.pop());
            }
        }
    }
}