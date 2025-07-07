namespace Script {
    import ƒ = FudgeCore;

    @ƒ.serialize
    export class DataLink extends ƒ.ComponentScript {
        static linkedNodes: Map<string, ƒ.Node> = new Map();

        @ƒ.serialize(String)
        public id: string;

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, () => {
                if (this.node instanceof ƒ.Graph)
                    DataLink.linkedNodes.set(this.id, this.node);
            });
        }
    }

    export enum ANIMATION {
        IDLE = "idle",
        MOVE = "move",
        HURT = "hurt",
        AFFECTED = "affected",
        DIE = "die",
        ATTACK = "attack",
        SPELL = "spell",
    }

    @ƒ.serialize
    export class AnimationLink extends ƒ.Component {
        public static linkedAnimations: Map<string, Map<ANIMATION, ƒ.Animation>> = new Map();

        protected singleton: boolean = false;

        @ƒ.serialize(ƒ.Animation)
        animation: ƒ.Animation;

        @ƒ.serialize(ANIMATION)
        animType: ANIMATION;

        constructor() {
            super();

            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, () => {
                if (this.node instanceof ƒ.Graph) {
                    let link = this.node.getComponent(DataLink);
                    if (!link) return;
                    if (!AnimationLink.linkedAnimations.has(link.id)) {
                        AnimationLink.linkedAnimations.set(link.id, new Map());
                    }
                    AnimationLink.linkedAnimations.get(link.id).set(this.animType, this.animation);
                }
            });
        }
    }
}