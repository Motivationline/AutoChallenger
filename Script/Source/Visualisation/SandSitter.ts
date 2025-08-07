namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class SandSitter extends ƒ.Component {
        @ƒ.serialize(ƒ.Animation)
        emerge: ƒ.Animation;
        @ƒ.serialize(ƒ.Animation)
        emerged_idle: ƒ.Animation;

        constructor() {
            super();
            this.addEventListener(ƒ.EVENT.COMPONENT_ACTIVATE, () => {
                this.addEventListeners();
            }, { once: true })
        }

        burried: boolean = false;
        buryNow = async (_ev: FightEvent) => {
            this.burried = true;
        }
        emergeNow = async (_ev: FightEvent) => {
            if (!this.burried) return;
            const vis = this.node.getParent() as VisualizeEntity;
            if(!vis) return;
            vis.defaultAnimation = this.emerged_idle;
            await vis.playAnimationIfPossible(this.emerge);
            this.burried = false;
        }

        addEventListeners() {
            EventBus.addEventListener(EVENT.FIGHT_START, this.buryNow);
            EventBus.addEventListener(EVENT.ROUND_END, this.emergeNow);
        }
    }
}