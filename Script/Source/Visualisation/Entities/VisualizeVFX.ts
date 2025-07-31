namespace Script {
    import ƒ = FudgeCore;
    export class VisualizeVFX {
        id: string;
        node: ƒ.Node;
        anim: ƒ.ComponentAnimation;
        delay: number = 0;

        constructor(_node: ƒ.Node, _id: string, _delay: number = 0) {
            this.node = _node;
            this.anim = this.findFirstAnimComp(this.node);
            this.id = _id;
            this.delay = _delay;
            this.deactivate();
        }

        public async addToAndActivate(_parent: ƒ.Node) {
            _parent.addChild(this.node);
            return this.activate();
        }

        public async activate() {
            this.node?.activate(true);
            if (this.anim) {
                this.anim.jumpTo(0);
                return new Promise<void>((resolve) => {
                    ƒ.Time.game.setTimer(this.delay * 1000, 1, () => {
                        this.anim.jumpTo(0);
                        this.anim.playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
                    });
                    ƒ.Time.game.setTimer(this.delay * 1000 + this.anim.animation.totalTime, 1, () => {
                        resolve();
                    });
                });
            }
        }

        public removeAndDeactivate() {
            this.node?.getParent()?.removeChild(this.node);
            this.deactivate();
        }

        public deactivate() {
            this.node?.activate(false);
            if (this.anim) {
                this.anim.playmode = ƒ.ANIMATION_PLAYMODE.STOP;
            }
        }

        private findFirstAnimComp(_node: ƒ.Node): ƒ.ComponentAnimation {
            const nodesToCheck: ƒ.Node[] = [_node];
            while (nodesToCheck.length > 0) {
                const node = nodesToCheck.shift();
                let cmp = node.getComponent(ƒ.ComponentAnimation)
                if (cmp) return cmp;
                nodesToCheck.push(...node.getChildren());
            }
            return undefined;
        }
    }
}