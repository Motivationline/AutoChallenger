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

        static async getCopyOf(_id: string): Promise<ƒ.Node> {
            let original = this.linkedNodes.get(_id);
            if (!original) return undefined;
            return getDuplicateOfNode(original);
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
        public static linkedAudio: Map<string, Map<ANIMATION, ƒ.Audio[]>> = new Map();

        protected singleton: boolean = false;

        @ƒ.serialize(ƒ.Animation)
        animation: ƒ.Animation;
        @ƒ.serialize(ƒ.Audio)
        audio1: ƒ.Audio;
        @ƒ.serialize(ƒ.Audio)
        audio2: ƒ.Audio;
        @ƒ.serialize(ƒ.Audio)
        audio3: ƒ.Audio;
        @ƒ.serialize(ƒ.Audio)
        audio4: ƒ.Audio;

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
                        AnimationLink.linkedAudio.set(link.id, new Map());
                    }
                    AnimationLink.linkedAnimations.get(link.id).set(this.animType, this.animation);
                    AnimationLink.linkedAudio.get(link.id).set(this.animType, []);
                    if(this.audio1) AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio1);
                    if(this.audio2) AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio2);
                    if(this.audio3) AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio3);
                    if(this.audio4) AnimationLink.linkedAudio.get(link.id).get(this.animType).push(this.audio4);
                }
            });
        }
    }

    
    @ƒ.serialize
    export class VisualizationLink extends ƒ.Component {
        public static linkedVisuals: Map<string, Map<ANIMATION, VisualizationLink>> = new Map();

        protected singleton: boolean = false;

        get id(){
            return this.visualization;
        }

        @ƒ.serialize(String)
        visualization: string;

        // TODO: this is hacky, use its own thing for it to properly map it to the actual events
        @ƒ.serialize(ANIMATION)
        for: ANIMATION;

        @ƒ.serialize(Number)
        delay: number;

        constructor() {
            super();

            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, () => {
                if (this.node instanceof ƒ.Graph) {
                    let link = this.node.getComponent(DataLink);
                    if (!link) return;
                    if (!VisualizationLink.linkedVisuals.has(link.id)) {
                        VisualizationLink.linkedVisuals.set(link.id, new Map());
                    }
                    VisualizationLink.linkedVisuals.get(link.id).set(this.for, this);
                }
            });
        }
    }


}